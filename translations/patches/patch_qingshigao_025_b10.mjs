#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0901: [
    'Prince Almuerging of Horqin was ordered to Fengtian to join Zhao Erxun in planning Mongol affairs.',
    'Horqin Prince Almuerging was sent to Fengtian to plan Mongol affairs with Zhao Erxun.',
  ],
  s0902: [
    'Mutinous troops attacked Jinling; Deputy Commander Wang Youhong died in battle.',
    'Rebel troops struck Jinling and Deputy Commander Wang Youhong was killed.',
  ],
  s0903: [
    'On day jiachen, Sun Baoqi renounced independence and impeached himself to await punishment.',
    'On jiachen day Sun Baoqi gave up independence and impeached himself to await sentence.',
  ],
  s0904: [
    'An edict pardoned him and commended Shandong officials and merchants who had not joined the revolt.',
    'He was pardoned and Shandong officials and merchants who stayed loyal were rewarded.',
  ],
  s0905: [
    'Treasury funds were issued to reward Zhang Xun\'s army.',
    'Treasury silver was sent to reward Zhang Xun\'s troops.',
  ],
  s0906: [
    'Liang Dingfen was granted third-rank capital bureau status and ordered to join Li Zhun in recovering Guangdong.',
    'Liang Dingfen received third-rank capital status and was told to help Li Zhun retake Guangdong.',
  ],
  s0907: [
    'On day bingwu, the revolutionary army took Jiangning; General Tieliang and Governor-General Zhang Renjun fled to Shanghai, and Zhang Xun withdrew the remnant force to hold Xuzhou.',
    'On bingwu day revolutionaries seized Jiangning; Tieliang and Zhang Renjun fled to Shanghai while Zhang Xun fell back to Xuzhou with what remained.',
  ],
  s0908: [
    'Yuan Shikai and the revolutionary army agreed on provisional ceasefire terms and halted fighting for three days.',
    'Yuan Shikai and the revolutionaries signed a temporary truce and stopped fighting for three days.',
  ],
  s0909: [
    'Extensions followed again and again until the day the form of government was decided.',
    'The truce was extended repeatedly until the national polity was settled.',
  ],
  s0910: [
    'Xu Shichang was appointed minister exclusively charged with training the Imperial Guard.',
    'Xu Shichang was made the minister in charge of drilling the Imperial Guard.',
  ],
  s0911: [
    'On day dingwei, Bao Fang was dismissed and Qi Yaolin was made Henan governor.',
    'On dingwei day Bao Fang was removed and Qi Yaolin became Henan governor.',
  ],
  s0912: [
    'Shou Xun was ordered to join Yuan Shikai and Xu Shichang in handling military affairs.',
    'Shou Xun was told to handle military affairs with Yuan Shikai and Xu Shichang.',
  ],
  s0913: [
    'On day wushen, the Jebtsundamba Khutuktu declared himself ruler and expelled the Urga resident commissioner San Duo.',
    'On wushen day the Jebtsundamba Khutuktu declared independence and drove out Urga commissioner San Duo.',
  ],
  s0914: [
    'An edict stripped San Duo of office.',
    'San Duo was dismissed by edict.',
  ],
  s0915: [
    'On day jiyou, posthumous honors were granted to Jiangxi Governor Feng Ruqi, who died for the dynasty.',
    'On jiyou day Jiangxi Governor Feng Ruqi, killed in service, received posthumous honors.',
  ],
  s0916: [
    'On day gengxu, Regent Prince Zai Feng memorialized the Empress Dowager, surrendered the regent\'s seal, and returned to his princely residence.',
    'On gengxu day Regent Prince Zai Feng memorialized the empress dowager, gave back the regent seal, and went home to his princedom.',
  ],
  s0917: [
    'An empress dowager edict promoted Shi Xu and Xu Shichang both to Grand Tutor to guard and protect the Emperor.',
    'The empress dowager made Shi Xu and Xu Shichang grand tutors to guard the emperor.',
  ],
  s0918: [
    'Duan Qirui was ordered to suppress bandits on the Dangyang and Tianmen routes.',
    'Duan Qirui was told to crush bandits along the Dangyang and Tianmen lines.',
  ],
  s0919: [
    'On day xinhai, an edict appointed Yuan Shikai plenipotentiary minister and authorized representatives to go south to discuss the overall situation.',
    'On xinhai day Yuan Shikai was made plenipotentiary minister with authority to send envoys south on the great settlement.',
  ],
  s0920: [
    'Feng Guozhang was made Chahar governor-general.',
    'Feng Guozhang became Chahar governor-general.',
  ],
  s0921: [
    'The Advisory Council asked to adopt the solar calendar and to allow subjects freely to cut their queues; an edict approved both.',
    'The Advisory Council sought the solar calendar and free queue-cutting; both were approved.',
  ],
  s0922: [
    'On day renzi, the minister for training the Imperial Guard was renamed president of the guard, with Feng Guozhang appointed.',
    'On renzi day the Imperial Guard training minister became guard president under Feng Guozhang.',
  ],
  s0923: [
    'Liang Bi was made military advisory commissioner of the General Staff.',
    'Liang Bi was appointed General Staff military advisory commissioner.',
  ],
  s0924: [
    'Posthumous honors were granted to Fujian-Zhejiang Governor-General Song Shou, who died for the dynasty.',
    'Fujian-Zhejiang Governor-General Song Shou, killed in service, received posthumous honors.',
  ],
  s0925: [
    'On day bingchen, the Chahan Aolai coal mine at Taiping Mountain in Heilongjiang Province was opened.',
    'On bingchen day Heilongjiang\'s Taiping Mountain Chahan Aolai coal mine was opened.',
  ],
  s0926: [
    'On day dingsi, the revolutionary army reached Jingzhou; Acting Left Deputy Commander Hengling died in defense.',
    'On dingsi day revolutionaries reached Jingzhou and Acting Left Deputy Commander Hengling was killed.',
  ],
  s0927: [
    'On day wuwu, the cabinet issued patriotic public bonds.',
    'On wuwu day the cabinet floated patriotic bonds.',
  ],
  s0928: [
    'On day xinyou, Sun Baoqi was dismissed and Hu Jianchu was made Shandong governor.',
    'On xinyou day Sun Baoqi was removed and Hu Jianchu became Shandong governor.',
  ],
  s0929: [
    'Eleventh month, new moon on day jiazi: Yuan Shikai asked to abolish the old system of sealed memorials from officials.',
    'In month 11, jiazi new moon, Yuan Shikai sought an end to sealed official memorials.',
  ],
  s0930: [
    'On day yichou, former acting Hubei legal commissioner Shi Jiyun and former Guanglu Temple vice minister Chen Zhong were ordered to manage Sichuan militia.',
    'On yichou day ex-acting Hubei legal commissioner Shi Jiyun and ex-Guanglu vice minister Chen Zhong were told to run Sichuan militia.',
  ],
  s0931: [
    'On day bingyin, Yin Changheng and Luo Lun of the Comrade Army entered the governor\'s yamen, seized former acting Sichuan governor and Sichuan-Yunnan frontier commissioner Zhao Erfeng, and when he would not yield, killed him.',
    'On bingyin day Yin Changheng and Luo Lun\'s Comrade Army seized Zhao Erfeng in the governor\'s yamen and killed him when he refused to submit.',
  ],
  s0932: [
    'On day wuchen, posthumous honors were granted to Guangdong Chaozhou garrison commander Zhao Guoxian, who died in service.',
    'On wuchen day Chaozhou commander Zhao Guoxian, killed in service, received posthumous honors.',
  ],
  s0933: [
    'On day renshen, the Empress Dowager ordered a provisional congress convened and the republican constitutional polity submitted to public decision.',
    'On renshen day the empress dowager ordered a provisional congress to decide the republican constitutional polity by public vote.',
  ],
  s0934: [
    'Earlier, Yuan Shikai had sent Tang Shaoyi south to discuss the overall situation with the revolutionary representative Wu Tingfang; Shanghai was the place of negotiation, and after repeated meetings Wu Tingfang insisted on abolishing the monarchy and founding a republic, which Tang Shaoyi could not overcome, so he said he must first memorialize for the throne\'s decision and then reported back.',
    'Earlier Yuan Shikai had sent Tang Shaoyi to negotiate in Shanghai with Wu Tingfang; Wu held out for abolishing the throne and a republic, Tang could not prevail, and he returned to seek the court\'s ruling.',
  ],
  s0935: [
    'Yuan Shikai memorialized asking to convene princes, dukes, and grand ministers for an imperial audience conference, and in the end the court followed his advice.',
    'Yuan Shikai asked for a princes-and-ministers audience conference and the court at last agreed.',
  ],
  s0936: [
    'Thereupon a date was set to open a national conference at Shanghai to settle the form of government.',
    'A national conference was then scheduled at Shanghai to decide the polity.',
  ],
  s0937: [
    'On day jiaxu, seventeen provincial representatives opened the provisional presidential election at Shanghai, elected a provisional president, established a government at Nanjing, and fixed the state name as the Republic of China.',
    'On jiaxu day seventeen provincial delegates at Shanghai elected a provisional president, set up government at Nanjing, and named the state the Republic of China.',
  ],
  s0938: [
    'On day wuyin, princes, nobles, and the imperial clan were urged to contribute wealth to support the armies.',
    'On wuyin day princes and nobles were urged to donate funds for the armies.',
  ],
  s0939: [
    'Chief justice Ding Cheng was dismissed and Liu Ruoceng replaced him.',
    'Chief justice Ding Cheng was removed and Liu Ruoceng took his place.',
  ],
  s0940: [
    'On day jimao, Yang Shiqi was dismissed and Liang Shiyi was appointed acting minister of posts and communications.',
    'On jimao day Yang Shiqi was removed and Liang Shiyi became acting posts minister.',
  ],
  s0941: [
    'On day xinsi, posthumous honors were granted to acting Sichuan governor, Guang-Han and Sichuan-Han railway commissioner, and expectant vice minister Duan Fang and his brother prefect Duan Jin, who died for the dynasty.',
    'On xinsi day Duan Fang, acting Sichuan governor and railway commissioner, and his brother Duan Jin received posthumous honors for dying in service.',
  ],
  s0942: [
    'The Salt Administration Bureau was abolished.',
    'The Salt Administration Bureau was cut.',
  ],
  s0943: [
    'Soldiers mutinied at Luanzhou and were pacified.',
    'A Luanzhou mutiny was pacified.',
  ],
  s0944: [
    'Yang Zuanxu, acting commander of the Ili New Army, mutinied and General Zhirui was killed.',
    'Ili New Army acting commander Yang Zuanxu mutinied and General Zhirui was killed.',
  ],
  s0945: [
    'On day dinghai, an edict was sent to admonish the Jebtsundamba Khutuktu, and treasures of former reigns were bestowed.',
    'On dinghai day the Jebtsundamba Khutuktu was admonished by edict and given former-dynasty treasures.',
  ],
  s0946: [
    'On day gengyin, posthumous honors were granted to acting Jingzhou Left Deputy Commander Hengling, who died for the dynasty.',
    'On gengyin day Acting Jingzhou Left Deputy Commander Hengling received posthumous honors for dying in service.',
  ],
  s0947: [
    'On day xinmao, Yuan Shikai was struck by a bomb on the road but not hit.',
    'On xinmao day a bomb was thrown at Yuan Shikai on the road and missed.',
  ],
  s0948: [
    'On day renchen, Zhang Huaiyi was ordered concurrently to assist in Shandong defense affairs.',
    'On renchen day Zhang Huaiyi was also told to help handle Shandong defense.',
  ],
  s0949: [
    'On day guisi, the responsible offices were ordered to protect foreigners\' lives and property.',
    'On guisi day officials were ordered to protect foreign lives and property.',
  ],
  s0950: [
    'Shu Qinga was ordered to assist in Hubei defense.',
    'Shu Qinga was told to help with Hubei defense.',
  ],
  s0951: [
    'Wu Zhen was made metropolitan garrison commander and the capital was placed under martial law.',
    'Wu Zhen became metropolitan garrison commander and Beijing was put under martial law.',
  ],
  s0952: [
    'Twelfth month, new moon on day jiawu: Zhang Huaiyi was granted acting governor rank.',
    'In month 12, jiawu new moon, Zhang Huaiyi received acting governor rank.',
  ],
  s0953: [
    'On day jiwei, former Shanxi Governor Lu Zhongqi was again granted a hereditary second-rank light-chariot commandancy; his son, Hanlin reader Lu Guangxi, killed at the same time, was posthumously made third-rank capital bureau officer with favors, posthumous title, and honors for Lu Zhongqi\'s wife, Lady Tang.',
    'On jiwei day Lu Zhongqi received a second hereditary light-chariot commandancy; his son Lu Guangxi, killed with him, was posthumously made third-rank capital officer with title and honors for Lady Tang.',
  ],
  s0954: [
    'On day dingyou, Zhang Renjun was dismissed and Zhang Xun was ordered to act as Liangjiang governor-general.',
    'On dingyou day Zhang Renjun was removed and Zhang Xun was told to act as Liangjiang governor-general.',
  ],
  s0955: [
    'Hu Jianchu was dismissed; Zhang Guangjian was appointed acting Shandong governor and Wu Dingyuan was ordered to assist in Shandong defense.',
    'Hu Jianchu was removed; Zhang Guangjian became acting Shandong governor and Wu Dingyuan helped on Shandong defense.',
  ],
  s0956: [
    'On day jihai, posthumous honors were granted to Ili General Zhirui, who died for the dynasty.',
    'On jihai day Ili General Zhirui, killed in service, received posthumous honors.',
  ],
  s0957: [
    'On day xinchou, an empress dowager edict said that because Yuan Shikai served the state with public loyalty, he was enfeoffed as first-class marquis.',
    'On xinchou day the empress dowager enfeoffed Yuan Shikai as first-class marquis for loyal public service.',
  ],
  s0958: [
    'Elerhun was appointed acting Ili general and Wen Qi was ordered to handle Tarbagatai councillor affairs.',
    'Elerhun became acting Ili general and Wen Qi took Tarbagatai councillor affairs.',
  ],
  s0959: [
    'Li Jiaju was dismissed and Xu Dingsen was made president of the Advisory Council.',
    'Li Jiaju was removed and Xu Dingsen became Advisory Council president.',
  ],
  s0960: [
    'Revolutionaries struck Liang Bi with an explosive and wounded his thigh; two days later he died.',
    'Revolutionaries bombed Liang Bi in the thigh; he died two days later.',
  ],
  s0961: [
    'On day renyin, Yuan Shikai declined the marquisate and only accepted after repeated earnest refusal.',
    'On renyin day Yuan Shikai refused the marquisate until repeated urging made him accept.',
  ],
  s0962: [
    'On day guimao, because Tong Pass was recovered, ten thousand taels of silver were granted to reward the army.',
    'On guimao day Tong Pass\'s recovery brought ten thousand taels to reward the troops.',
  ],
  s0963: [
    'On day jiachen, because of merit at Hanyang, Zhang Biao was restored to provincial commander.',
    'On jiachen day Zhang Biao was restored to provincial commander for Hanyang merit.',
  ],
  s0964: [
    'On day yisi, Zhang Huaiyi was made Anhui governor.',
    'On yisi day Zhang Huaiyi became Anhui governor.',
  ],
  s0965: [
    'Posthumous honors were granted to Fuzhou General Pu Shou, who died for the dynasty.',
    'Fuzhou General Pu Shou, killed in service, received posthumous honors.',
  ],
  s0966: [
    'On day dingwei, Zhang Xiluan was ordered to Fengtian to assist in defense; Li Shengduo was appointed acting Shanxi governor and Lu Yongxiang was ordered to assist in Shanxi military affairs.',
    'On dingwei day Zhang Xiluan went to Fengtian on defense; Li Shengduo became acting Shanxi governor and Lu Yongxiang helped Shanxi command.',
  ],
  s0967: [
    'Posthumous honors were granted to General Staff military advisory commissioner Liang Bi, who was killed.',
    'General Staff commissioner Liang Bi, assassinated, received posthumous honors.',
  ],
  s0968: [
    'On day wushen, Wang Geng was made General Staff military advisory commissioner.',
    'On wushen day Wang Geng became General Staff military advisory commissioner.',
  ],
  s0969: [
    'On day jiyou, an empress dowager edict granted Yuan Shikai full authority to negotiate terms with the revolutionary army and memorialize the results.',
    'On jiyou day the empress dowager gave Yuan Shikai full power to negotiate with the revolutionaries and report up.',
  ],
  s0970: [
    'At that time Cen Chunxuan, Yuan Shukun, Lu Zhengxiang, Duan Qirui, and others asked that the republican polity be settled quickly to spare the people further slaughter; therefore, without waiting for the congress to convene, the decision was made to yield power, and this order followed.',
    'Cen Chunxuan, Yuan Shukun, Lu Zhengxiang, Duan Qirui, and others then urged a swift republic to spare the people; without waiting for congress the court decided to yield power.',
  ],
  s0971: [
    'On day gengxu, Kun Yuan was ordered to assist in Rehe defense.',
    'On gengxu day Kun Yuan was told to help with Rehe defense.',
  ],
  s0972: [
    'On day xinhai, Song Xiaolian was appointed acting Heilongjiang governor.',
    'On xinhai day Song Xiaolian became acting Heilongjiang governor.',
  ],
  s0973: [
    'On day renzi, Xu Shichang was dismissed as military advisory minister; posthumous honors were granted to Gansu provincial administration commissioner Shi Zeng, who died for the dynasty in Yunnan.',
    'On renzi day Xu Shichang left the military advisory post; Gansu commissioner Shi Zeng, killed in Yunnan service, received posthumous honors.',
  ],
  s0974: [
    'On day yimao, Xi Liang was dismissed and Kun Yuan was appointed acting Rehe governor-general.',
    'On yimao day Xi Liang was removed and Kun Yuan became acting Rehe governor-general.',
  ],
  s0975: [
    'On day dingsi, unpaid land-tax grain and transport dues for Jiangsu\'s Xuzhou Prefecture were remitted.',
    'On dingsi day unpaid Xuzhou land tax and transport grain were forgiven.',
  ],
  s0976: [
    'On day wuwu, Yuan Shikai memorialized that in negotiations with the southern representative Wu Tingfang he endorsed the republic and submitted eight conditions for preferential treatment of the imperial house, four for treatment of the imperial clan, and seven for treatment of Manchus, Mongols, Muslims, and Tibetans—nineteen articles in all.',
    'On wuwu day Yuan Shikai reported agreement with Wu Tingfang on a republic plus nineteen articles on the throne, the clan, and Manchu-Mongol-Muslim-Tibetan treatment.',
  ],
  s0977: [
    'The Empress Dowager ordered Yuan Shikai, with full authority, to establish a provisional republican government and negotiate unified arrangements with the revolutionary army.',
    'The empress dowager told Yuan Shikai to form a provisional republican government and negotiate unity with the revolutionaries.',
  ],
  s0978: [
    'Yuan Shikai thereupon carried out the empress dowager\'s edict and proclaimed to China and abroad: 「Previously, because the revolutionary army rose in arms and the provinces answered in succession, the empire seethed through nine summers and the people were ground under war.',
    'Yuan Shikai then proclaimed the empress dowager\'s edict at home and abroad: 「Earlier the revolutionary army rose, the provinces followed, the realm boiled nine summers long, and the people burned in war.',
  ],
  s0979: [
    'The court had specially ordered Yuan Shikai to send envoys to discuss the overall situation with revolutionary representatives, to open a congress, and to decide the polity by public vote.',
    'The throne had ordered Yuan Shikai to send envoys south, open a congress, and let the polity be decided by vote.',
  ],
  s0980: [
    'For two months there had still been no settled plan.',
    'Two months passed with no settled plan.',
  ],
  s0981: [
    'North and south stood apart and each side held fast.',
    'North and south were estranged and locked in stalemate.',
  ],
  s0982: [
    'Merchants halted on the roads and scholars lay exposed in the fields.',
    'Trade stopped on the roads and scholars slept in the open fields.',
  ],
  s0983: [
    'While the form of government went undecided for a single day, the people\'s livelihood knew no peace for a single day.',
    'One day without a settled polity meant one more day without peace for the people.',
  ],
  s0984: [
    'Now the mind of the whole nation inclines overwhelmingly toward a republic.',
    'Now the whole nation\'s heart leaned toward republic.',
  ],
  s0985: [
    'The southern provinces had raised the standard first; northern commanders had also declared for it afterward.',
    'The south had risen first; northern generals had followed.',
  ],
  s0986: [
    'Where hearts turn, Heaven\'s mandate may be known.',
    'Where hearts turn, Heaven\'s mandate is plain.',
  ],
  s0987: [
    'How could We bear, for the honor of one surname, to go against the likes and dislikes of the myriad people?',
    'How could We cling to one clan\'s honor against the will of the myriad people?',
  ],
  s0988: [
    'Therefore, looking outward at the great trend and inward at public sentiment, We specially lead the Emperor to yield ruling power to the whole nation and fix a constitutional republic as the polity.',
    'Reading the great trend abroad and public feeling within, We yield the emperor\'s ruling power to the nation and fix a constitutional republic.',
  ],
  s0989: [
    'This will soon ease the empire\'s weariness of chaos and longing for order, and in the long run accord with the ancient sages\' principle that all under Heaven is for the public.',
    'It will ease the empire\'s hunger for peace now and match the sages\' teaching that all under Heaven belongs to all.',
  ],
  s0990: [
    'Yuan Shikai had earlier been chosen by the Advisory Council as prime minister; at this passage between old and new, he should serve as the means of north-south unity.',
    'Yuan Shikai, already chosen prime minister by the Advisory Council, should bridge old and new and unite north and south.',
  ],
  s0991: [
    'Let Yuan Shikai therefore, with full authority, organize a provisional republican government and negotiate unified arrangements with the revolutionary army.',
    'Let Yuan Shikai, with full power, form a provisional republican government and negotiate unity with the revolutionaries.',
  ],
  s0992: [
    'The aim is that the people may dwell in peace, the realm be governed in tranquillity, and the complete territory of the five peoples—Manchu, Mongol, Han, Muslim, and Tibetan—still form one great Republic of China.',
    'The aim is peace for the people, order for the realm, and one Republic of China embracing Manchu, Mongol, Han, Muslim, and Tibetan lands entire.',
  ],
  s0993: [
    'The Emperor and We may then withdraw to ease, pass the years in leisure, receive the nation\'s courteous treatment, and ourselves witness the accomplishment of perfect order—would that not be glorious!',
    'The emperor and We may then retire in ease, enjoy the nation\'s courtesy, and see perfect order achieved—what glory could exceed it!',
  ],
  s0994: [
    '」It also said: 「Of old, those who held all under Heaven valued preserving the people\'s lives and could not bear to harm men in order to nourish men.',
    '」It also said: 「Ancient rulers held the realm to preserve life and would not harm the people to feed power.',
  ],
  s0995: [
    'In fixing the new polity now, the purpose is solely to end great disorder first and to secure lasting peace.',
    'The new polity is meant first to end great disorder and secure lasting peace.',
  ],
  s0996: [
    'If We go against the heart of the majority and reopen endless war, the great settlement will shatter, slaughter will chase slaughter, and the horror of racial catastrophe will unfold.',
    'Defy the majority and war without end will shatter the settlement, slaughter breed slaughter, and racial catastrophe follow.',
  ],
  s0997: [
    'The ancestral temples will be shaken, the myriad people poisoned—how can later disaster even be spoken of?',
    'The ancestral temples will shake, the myriad people suffer—later disaster beggars words.',
  ],
  s0998: [
    'When two harms stand side by side, take the lighter.',
    'Between two harms, choose the lighter.',
  ],
  s0999: [
    'This is precisely the court\'s careful reading of the times, watching change, and heartfelt care for the people\'s suffering.',
    'This is the court reading the times, watching change, and weighing the people\'s pain.',
  ],
  s1000: [
    'All of you, officials and people within and beyond the capital, must deeply grasp this intent, weigh the whole situation\'s gain and loss, and not indulge empty pride or reckless extremes that would make state and people suffer together.',
    'Officials and people everywhere must grasp this intent, weigh the whole situation, and not let pride or reckless words harm state and people alike.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_025_b10.mjs <translation.json>'
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
