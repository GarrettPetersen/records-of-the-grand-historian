#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'On day xinwei, the Emperor made an inspection tour of the capital region and instructed Governor Zhao Hongxie: "Last year\'s late snows were abundant and this year\'s spring rains are seasonable; the people\'s fields should have been sown early.',
    'On xinwei day, touring the capital region, the Emperor told Governor Zhao Hongxie that abundant snow and timely spring rain should have let farmers sow early.',
  ],
  s0702: [
    'But We fear that if sprouts come up too thickly, there may be risk of double blight.',
    'He warned that overly dense sprouting might bring double blight.',
  ],
  s0703: [
    'You should instruct farmers that hoeing and weeding should be rather sparse, to guard against wind and dust storms.',
    'Farmers should be told to weed thinly to guard against wind and dust.',
  ],
  s0704: [
    '" The Emperor also instructed: "On Our tours of the capital region We see the people\'s livelihood somewhat better than before.',
    'He added that on his tours he saw livelihoods somewhat improved.',
  ],
  s0705: [
    'But few read and recite—customs are at stake.',
    'Yet few studied, which touched on public morals.',
  ],
  s0706: [
    'You should order charity schools widely set up in remote villages and encourage reading.',
    'He ordered charity schools in remote villages and urged study.',
  ],
  s0707: [
    'You officials should take heed."',
    'Local officials were to take heed."',
  ],
  s0708: [
    '" On day jiawu, Du Chengsi was made Jiangnan provincial commander and Mu Tingxue Fujian land-route provincial commander.',
    'On jiawu day, Du Chengsi became Jiangnan commander and Mu Tingxue Fujian land commander.',
  ],
  s0709: [
    'Third month, day jihai: because of snow disaster in the fourteen banners of the Mongol Urad and other tribes, Minister Mu Helun was ordered to transport grain for relief and teach them to fish for food.',
    'In the third month, Mu Helun was sent with grain to relieve fourteen snow-stricken Urad banners and teach them to fish.',
  ],
  s0710: [
    'On day gengzi, Zhao Hongxie was made governor-general of Zhili, retaining provincial governor duties.',
    'On gengzi day, Zhao Hongxie became Zhili governor-general while keeping governor duties.',
  ],
  s0711: [
    'Musen was made Ningguta general.',
    'Musen became Ningguta general.',
  ],
  s0712: [
    'Summer, fourth month, day gengwu: Xu Taozhang and one hundred ninety others were granted jinshi and other ranks with distinctions.',
    'In the fourth month, Xu Taozhang and 190 others received jinshi degrees.',
  ],
  s0713: [
    'On day jimao, Shi Yide memorialized that Tsewang Arabtan\'s troops had raided Hami; Guerrilla Commander Pan Zhishan defeated them.',
    'On jimao day, Shi Yide reported Tsewang Arabtan\'s raid on Hami and Pan Zhishan\'s victory.',
  ],
  s0714: [
    'Minister Fu Ning\'an and General Xi Zhu were ordered to lead troops in relief and suppression; Qilide was sent to the Tuhe River; Khalkha and others were instructed to ready troops.',
    'Fu Ning\'an and Xi Zhu were ordered to campaign; Qilide went to the Tuhe River; Khalkha was told to ready troops.',
  ],
  s0715: [
    'On day gengchen, foreign-banner troops were summoned to assemble at Guihua City; Solon hunting troops were dispatched to the Tuhe River.',
    'On gengchen day, frontier troops gathered at Guihua City and Solon hunters were sent to the Tuhe River.',
  ],
  s0716: [
    'On day jichou, the Emperor instructed the Council of Princes: "We once campaigned beyond the passes in person and know the strategic points thoroughly.',
    'On jichou day, the Emperor told the Council of Princes he knew the frontier from personal campaigns.',
  ],
  s0717: [
    'Now in punishing Tsewang Arabtan there are three routes of advance: one from Gas straight to the source of the Ili River, pressing on his lair;',
    'To attack Tsewang Arabtan he proposed three routes: from Gas to the Ili headwaters and his lair;',
  ],
  s0718: [
    'one crossing Hami and Turfan to raid deep into enemy territory;',
    'one through Hami and Turfan deep into enemy country;',
  ],
  s0719: [
    'one by way of Khalkha to Bokeduo E\'lun Habierhan, crossing the pass to seize commanding ground.',
    'one via Khalkha to Bokeduo E\'lun Habierhan to hold the passes.',
  ],
  s0720: [
    'Advancing on three roads at once, great success is certain."',
    'A three-pronged advance would surely succeed."',
  ],
  s0721: [
    '" On day renwu, Grain Transport Governor Lang Tingji died; the Emperor praised his care for transport boatmen and unobstructed shipments, granted sacrificial rites and burial honors, and gave the posthumous title Wenqin.',
    'On renwu day, Lang Tingji died; the court praised his care for boatmen, granted funeral honors, and gave posthumous name Wenqin.',
  ],
  s0722: [
    'On day xinmao, the Emperor accompanied the Empress Dowager to Rehe for summer retreat.',
    'On xinmao day, the Emperor escorted the Empress Dowager to Rehe.',
  ],
  s0723: [
    'On day yiwei, Fu Ning\'an was ordered to divide troops to garrison Gas Pass; Regional Commander Lu Zhensheng was stationed at Hami.',
    'On yiwei day, Fu Ning\'an garrisoned Gas Pass and Lu Zhensheng was posted at Hami.',
  ],
  s0724: [
    'Fifth month, day bingwu: Heilongjiang General, imperial clansman Yang Fu, died; one thousand taels of silver were granted; Guards Shang Chongyi and Fu Sen were hurried by post-horse to offer sacrifice; posthumous title Xiangyi; his son Sanguanbao was ordered temporarily to act in his father\'s post.',
    'In the fifth month, Heilongjiang General Yang Fu died; guards were sent to sacrifice; posthumous name Xiangyi; his son Sanguanbao acted in his place.',
  ],
  s0725: [
    'On day wuwu, Inner Secretariat Reader Tulichen was sent as envoy to Russia to have them ready troops.',
    'On wuwu day, Tulichen was sent to Russia to arrange troop readiness.',
  ],
  s0726: [
    'Sixth month, day renshen: Commander-in-chief Tusihai and others were ordered to the Hutang rivers north to transport grain.',
    'In the sixth month, Tusihai and others were ordered north of the Hutang to move grain.',
  ],
  s0727: [
    'On day jiaxu, Fu Ning\'an and Xi Zhu memorialized on the strategy of advance.',
    'On jiaxu day, Fu Ning\'an and Xi Zhu reported their advance strategy.',
  ],
  s0728: [
    'An imperial rescript was received: advance troops next year.',
    'The Emperor ordered the campaign deferred until the next year.',
  ],
  s0729: [
    'On day dinghai, Minister of War Sun Zhenghao died; he was granted two saddled horses, two unsaddled horses, and five hundred taels of silver; posthumous title Qingduan.',
    'On dinghai day, Minister of War Sun Zhenghao died with funeral gifts and posthumous name Qingduan.',
  ],
  s0730: [
    'Autumn, seventh month, first day jiayin: Duke Bobei of the KhotoGirats was ordered to win over the Uriankhai.',
    'On the first of the seventh month, Duke Bobei was ordered to win over the Uriankhai.',
  ],
  s0731: [
    'On day xinyou, Duke Furdan was ordered to open farming colonies at Ulan Gu and other places.',
    'On xinyou day, Duke Furdan was sent to farm at Ulan Gu and elsewhere.',
  ],
  s0732: [
    'Eighth month, day xinwei: Grand Secretary Li Guangdi asked leave to return home; the Emperor composed a poem seeing him off.',
    'In the eighth month, Li Guangdi took leave; the Emperor wrote a farewell poem.',
  ],
  s0733: [
    'On day guiyou, the Emperor went on the hunting encirclement.',
    'On guiyou day, the Emperor went hunting.',
  ],
  s0734: [
    'On day renchen, garrison troops at Gas Pass were withdrawn back to Suzhou.',
    'On renchen day, the Gas Pass garrison withdrew to Suzhou.',
  ],
  s0735: [
    'Ninth month, day jiyou: the Uriankhai tribes won over by Bobei came to submit.',
    'In the ninth month, Uriankhai tribes won over by Bobei submitted.',
  ],
  s0736: [
    'Winter, tenth month, day bingyin: the Emperor told Grand Secretaries: "Our right hand is ill and cannot write; We use the left hand to hold the brush and endorse memorials, aiming at no leakage."',
    'In the tenth month, the Emperor said his right hand was too ill to write and he endorsed memorials left-handed to avoid leaks.',
  ],
  s0737: [
    '" On day xinsi, the Emperor accompanied the Empress Dowager back to the palace.',
    'On xinsi day, the Emperor returned with the Empress Dowager to the palace.',
  ],
  s0738: [
    'An edict: because Shuntian, Baoding, Hejian, Yongping, and Xuanhua had excessive rain this year and grain failed, all tax grain due for the fifty-fifth year from the five prefectures was wholly remitted.',
    'Tax grain for the fifty-fifth year was remitted in five rain-stricken prefectures.',
  ],
  s0739: [
    'Eleventh month, day jiawu: Fan Shichong was made Left Censor-in-chief; Aisin Gioro Manbao governor-general of Zhejiang and Fujian; imperial clansman Base Mongol commander-in-chief.',
    'In the eleventh month, Fan Shichong, Manbao, and Base received new posts.',
  ],
  s0740: [
    'On day gengzi, executions in the capital were suspended.',
    'On gengzi day, capital executions were halted.',
  ],
  s0741: [
    'On day xinchou, Song minister Fan Zhongyan was ordered enshrined in the Confucian temple.',
    'On xinchou day, Fan Zhongyan was added to the Confucian temple sacrifices.',
  ],
  s0742: [
    'On day jiwei, winter solstice: Heaven was sacrificed to at the Round Altar; the imperially fixed court ritual music was used for the first time.',
    'On the winter solstice the court used the new imperial ritual music at the Round Altar.',
  ],
  s0743: [
    'Twelfth month, day jisi: Tabai was made Hangzhou general.',
    'In the twelfth month, Tabai became Hangzhou general.',
  ],
  s0744: [
    'Guard-commander Yanbu was ordered to lead troops stationed at Xining.',
    'Yanbu was ordered to command troops at Xining.',
  ],
  s0745: [
    'On day jiashen, Zhang Boxing, convicted on a charge of slanderously impeaching over suspect bribes and sentenced to death, was pardoned by the Emperor and reappointed Granary Commissioner.',
    'On jiashen day, Zhang Boxing, sentenced to death for a slander charge, was pardoned and made Granary Commissioner.',
  ],
  s0746: [
    'This year, disaster land tax for twenty-four districts in Jiangnan and Hunan was remitted in varying degrees.',
    'Tax relief was granted for twenty-four disaster districts in Jiangnan and Hunan.',
  ],
  s0747: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s0748: [
    'Fifty-fifth year, spring, first month, day renzi: the Emperor visited the hot springs.',
    'In the fifty-fifth year, on the first day of spring, the Emperor visited the hot springs.',
  ],
  s0749: [
    'Second month, day yichou: Vice Commander-in-chief Su Erde was ordered to manage farming colonies at Tuhuluoke and other places.',
    'In the second month, Su Erde was assigned to open farms at Tuhuluoke and elsewhere.',
  ],
  s0750: [
    'On day guiyou, the Emperor returned and halted at Shenyang Spring Garden.',
    'On guiyou day, the Emperor returned to Shenyang Spring Garden.',
  ],
  s0751: [
    'On day bingzi, an edict exempted Annam from annual tribute of rhinoceros horn and ivory.',
    'On bingzi day, Annam was exempted from rhinoceros horn and ivory tribute.',
  ],
  s0752: [
    'On day jimao, the Emperor toured the capital region.',
    'On jimao day, the Emperor toured the capital region.',
  ],
  s0753: [
    'On day gengyin, regulations were fixed for corvée labor drafts according to locality.',
    'On gengyin day, corvée draft rules were set by locality.',
  ],
  s0754: [
    'Third month, day dingyou: posthumous honors were granted and an official sinecure to Provincial Commander Wang Qiyun of Right River, Guangxi, killed suppressing Yao rebels.',
    'In the third month, Wang Qiyun, killed fighting Yao rebels, received posthumous honors and a sinecure for his son.',
  ],
  s0755: [
    'On day gengzi, the Emperor returned to the palace.',
    'On gengzi day, the Emperor returned to the palace.',
  ],
  s0756: [
    'On day yisi, Xi Zhu was recalled; Yanbu replaced him; Lu Zhensheng assisted military affairs.',
    'On yisi day, Xi Zhu was recalled, Yanbu replaced him, and Lu Zhensheng assisted command.',
  ],
  s0757: [
    'On day guichou, Mongol Tu\'erhute Beile Alabuzhu\'er asked to join the campaign.',
    'On guichou day, Tu\'erhute Beile Alabuzhu\'er asked to join the campaign.',
  ],
  s0758: [
    'He was ordered to lead Mongol troops to garrison Gas Pass.',
    'He was ordered to garrison Gas Pass with Mongol troops.',
  ],
  s0759: [
    'Guizhou Governor Liu Yishu memorialized asking to halt troops; he was ordered to travel post-haste to the army, inspect on circuit, and memorialize discussion.',
    'Liu Yishu asked to halt the campaign and was sent post-haste to inspect the army and report.',
  ],
  s0760: [
    'Intercalary third month, day guihai: Erlunte was made acting Xi\'an general; Manbao acting Huguang governor-general.',
    'In the intercalary third month, Erlunte and Manbao received acting frontier posts.',
  ],
  s0761: [
    'On day dingchou, Zuo Shiyong was made Guangxi provincial commander.',
    'On dingchou day, Zuo Shiyong became Guangxi commander.',
  ],
  s0762: [
    'On day renwu, two hundred thousand shi of capital-granary grain were distributed to relieve Shuntian and Yongping.',
    'On renwu day, 200,000 shi of grain were sent to relieve Shuntian and Yongping.',
  ],
  s0763: [
    'The Five Cities porridge kitchens were extended until autumn.',
    'Capital porridge kitchens were extended through autumn.',
  ],
  s0764: [
    'The Ministry of Rites was ordered to pray for rain.',
    'The Ministry of Rites was ordered to pray for rain.',
  ],
  s0765: [
    'Summer, fourth month, day guimao: the Emperor accompanied the Empress Dowager to Rehe.',
    'In the fourth month, the Emperor escorted the Empress Dowager to Rehe.',
  ],
  s0766: [
    'Fifth month, day gengshen: the Emperor halted at Rehe, living in abstinence and praying for rain.',
    'In the fifth month, at Rehe the Emperor fasted and prayed for rain.',
  ],
  s0767: [
    'Ma Qi was recalled as Grand Secretary; Mu Helun Minister of Revenue.',
    'Ma Qi became Grand Secretary; Mu Helun Minister of Revenue.',
  ],
  s0768: [
    'On day renxu, granary grain was sold at fair price.',
    'On renxu day, granary grain was sold at fair price.',
  ],
  s0769: [
    'Banner troops\' grain rations were issued in advance.',
    'Banner grain rations were issued early.',
  ],
  s0770: [
    'On day jiazi, rain fell.',
    'On jiazi day, it rained.',
  ],
  s0771: [
    'The Emperor said: "Song Confucians said: \'Pray for rain and get rain—can drought be without cause?\'',
    'The Emperor quoted Song Confucians: prayer for rain succeeds because drought has causes.',
  ],
  s0772: [
    '" This remark is worth savoring."',
    'He said the remark was worth pondering."',
  ],
  s0773: [
    '" On day jisi, rain was sufficient near and far around the capital; the Emperor resumed his normal diet.',
    'On jisi day, rain was ample around the capital and the Emperor resumed normal meals.',
  ],
  s0774: [
    'On day yiyou, He Yi was dismissed; Sun Zhaji was made Minister of Works.',
    'On yiyou day, He Yi left office and Sun Zhaji became Minister of Works.',
  ],
  s0775: [
    'Sixth month, day bingchen: the Emperor visited the hot springs.',
    'In the sixth month, the Emperor visited the hot springs.',
  ],
  s0776: [
    'Autumn, seventh month, day xinwei: garrison troops at Gas Pass were ordered moved to be stationed in part at Chahan Usu and Gasun.',
    'In the seventh month, the Gas Pass garrison was split between Chahan Usu and Gasun.',
  ],
  s0777: [
    'On day guiwei, the Emperor went on the hunting encirclement.',
    'On guiwei day, the Emperor went hunting.',
  ],
  s0778: [
    'Eighth month, day yimao: former Fengtian intendant Dong Hongyi, because he had changed grain and beans levies to silver in nine Chengde districts and counties, causing granary shortfalls, was dismissed from office.',
    'In the eighth month, Dong Hongyi was dismissed for converting Chengde grain levies to silver and depleting stores.',
  ],
  s0779: [
    'Ninth month, day gengwu: Jiang Chenxi was made governor-general of Yunnan and Guizhou.',
    'In the ninth month, Jiang Chenxi became Yunnan-Guizhou governor-general.',
  ],
  s0780: [
    'On day jiashen, the Emperor accompanied the Empress Dowager back to the palace.',
    'On jiashen day, the Emperor returned with the Empress Dowager to the palace.',
  ],
  s0781: [
    'Winter, tenth month, first day dinghai: an edict ordered the Ministry of Punishments to reduce or release in categories prisoners under the delayed-execution procedure long held for many years.',
    'On the first of the tenth month, long-held prisoners awaiting review were to be reduced or released by category.',
  ],
  s0782: [
    'This year\'s autumn executions were suspended.',
    'Autumn executions were halted for the year.',
  ],
  s0783: [
    'On day wuzi, Tuoliu was made Heilongjiang general; Zhao Hongcan Minister of War.',
    'On wuzi day, Tuoliu became Heilongjiang general and Zhao Hongcan Minister of War.',
  ],
  s0784: [
    'On day guisi, an edict said: "Recently, because Tsewang Arabtan invaded Hami, troops were levied and the frontier prepared; all rushed transport of fodder and grain passing through border regions necessarily draws on the people\'s strength.',
    'On guisi day, an edict cited frontier mobilization against Tsewang Arabtan and the burden on border populations.',
  ],
  s0785: [
    'All silver, grain, fodder, and grass due next year from forty-eight districts in Shanxi, Shaanxi, and Gansu, together with years of arrears, are wholly remitted."',
    'Next year\'s levies and arrears in forty-eight Shanxi, Shaanxi, and Gansu districts were wholly remitted."',
  ],
  s0786: [
    '" On day dingyou, an edict ordered that north of Jiuquan, places adjoining Bulongji\'er such as Xijimu, Dalitu, and Jintasi, bordering Suzhou, recruit settlers for farming.',
    'On dingyou day, settlers were recruited to farm north of Suzhou near Bulongji\'er.',
  ],
  s0787: [
    'Yang Lin was made governor-general of Guangdong and Guangxi.',
    'Yang Lin became Guangdong-Guangxi governor-general.',
  ],
  s0788: [
    'Imperial clansman Base was made Manchu commander-in-chief; Yanbu Mongol commander-in-chief.',
    'Base became Manchu commander-in-chief; Yanbu Mongol commander-in-chief.',
  ],
  s0789: [
    'On day bingwu, Tsewang Arabtan seized Qinghai taiji Lobzang Danjinbu, attacked Gas Pass, and government troops drove him off.',
    'On bingwu day, Tsewang Arabtan seized a Qinghai taiji, attacked Gas Pass, and was repulsed.',
  ],
  s0790: [
    'Erlunte was ordered to station troops at Xining; troops were divided to garrison Gas Pass; Bulongji\'er Courtier without Rank Alana was sent to Barkul to assist in military affairs.',
    'Erlunte was posted at Xining, troops garrisoned Gas Pass, and Alana was sent to Barkul as military aide.',
  ],
  s0791: [
    'Eleventh month, day yichou: Furdan and E\'erjin were made chief imperial bodyguard ministers.',
    'In the eleventh month, Furdan and E\'erjin became chief bodyguard ministers.',
  ],
  s0792: [
    'On day wuchen, the Emperor paid respects at the imperial tombs.',
    'On wuchen day, the Emperor visited the imperial tombs.',
  ],
  s0793: [
    'On day jiashen, the Emperor toured beyond the passes.',
    'On jiashen day, the Emperor toured the frontier.',
  ],
  s0794: [
    'The Ming imperial tombs were robbed; an order was issued to punish by law.',
    'Robbers broke into the Ming tombs; the court ordered punishment.',
  ],
  s0795: [
    'Twelfth month, day jiyou: the Emperor returned to Beijing.',
    'In the twelfth month, the Emperor returned to Beijing.',
  ],
  s0796: [
    'An edict remitted land tax and corvée grain for thirty-five districts in Shuntian and Yongping for the coming year, and arrears were also cleared.',
    'Land tax was remitted for thirty-five Shuntian and Yongping districts, with arrears cleared.',
  ],
  s0797: [
    'This year, disaster land tax for sixty-three districts in Zhili, Jiangnan, Shandong, Zhejiang, Jiangxi, Huguang, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for sixty-three disaster districts across several provinces.',
  ],
  s0798: [
    'Korea and Annam sent tribute.',
    'Korea and Annam paid tribute.',
  ],
  s0799: [
    'Fifty-sixth year, spring, first month, day dingmao: compilation of the Zhouyi zhezong was completed and issued to the schools.',
    'In the fifty-sixth year, on the first day of spring, the Zhouyi zhezong was completed and issued to schools.',
  ],
  s0800: [
    'On day renwu, Xu Yuanmeng was made Left Censor-in-chief; Zhu Shi Zhejiang provincial governor.',
    'On renwu day, Xu Yuanmeng became Left Censor-in-chief and Zhu Shi Zhejiang governor.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_008_b08.mjs <translation.json>'
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
