#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Grand Secretary Zhang Zhiwan retired from office.',
    'Zhang Zhiwan retired as grand secretary.',
  ],
  s0202: [
    'On day dingwei, the German minister Heyking and the Belgian minister Fige were received at Wenhua Hall.',
    'On dingwei day Heyking and Fige were received at Wenhua Hall.',
  ],
  s0203: [
    'On day gengxu, Li Hongzhang was ordered to serve at the Zongli Yamen for Foreign Affairs.',
    'On gengxu day Li Hongzhang was assigned to the Zongli Yamen.',
  ],
  s0204: [
    'On day guichou, Li Bingheng reported that the Yellow River mouth had been surveyed and proposed dredging a new channel from the old Yellow River\'s east bank to guide the flow back into the old river to reach the sea.',
    'On guichou day Li Bingheng proposed dredging a new channel off the old Yellow River\'s east bank to restore the old outlet.',
  ],
  s0205: [
    'An edict ordered the work undertaken on a large scale so that it would be done once for all and fulfill the commission.',
    'An edict ordered a full-scale permanent fix.',
  ],
  s0206: [
    'That autumn, flood relief was granted in Henan, Fengtian, Hubei, Anhui, Shandong, Shanxi, Jilin, and Heilongjiang; dragon-flood relief in Hunan; flood and hail relief in Shaanxi and Gansu; locust and hail relief in Xinjiang; and wind-disaster relief on Guangdong\'s coastal waters.',
    'That autumn many provinces received flood, hail, locust, and coastal wind relief.',
  ],
  s0207: [
    'Winter, tenth month, new moon on day renxu: flood relief was granted for disasters on the Yangtze and Han rivers in Hubei.',
    'In winter month 10, renxu new moon, Hubei Yangtze and Han flood victims were relieved.',
  ],
  s0208: [
    'On day guihai, winter famine relief was organized in Hezhou.',
    'On guihai day Hezhou winter relief was arranged.',
  ],
  s0209: [
    'On day jiazi, four customs posts were added at Suzhou, Hangzhou, Shashi, and Simao.',
    'On jiazi day customs were opened at Suzhou, Hangzhou, Shashi, and Simao.',
  ],
  s0210: [
    'On day bingyin, Tao Mo was instructed to select upright and capable officials, reconcile Han and Hui, judge disputes solely on right and wrong and settle them by reason, and give separate relief to war-stricken areas.',
    'On bingyin day Tao Mo was told to pick honest officials, reconcile Han and Hui, judge fairly, and aid war zones.',
  ],
  s0211: [
    'For merit in pacifying the Hui, Dong Fuxiang was granted a hereditary Commandant of Cavalry post; Tao Mo was made governor-general of Shaanxi and Gansu; Rao Yingqi was made governor of Xinjiang; Kui Shun and Wei Guangtao received preferential commendation; and the rest were rewarded in varying degrees.',
    'Pacifying the Hui, Dong Fuxiang received a hereditary title, Tao Mo became Shaanxi-Gansu governor-general, Rao Yingqi Xinjiang governor, and others were commended.',
  ],
  s0212: [
    'On day jiaxu, the Yongding River breach was closed.',
    'On jiaxu day the Yongding River breach was sealed.',
  ],
  s0213: [
    'On day wuyin, it was decided that Korea would have a consul but no treaty, no envoy, and no state letter; one consul-general would be stationed in its capital.',
    'On wuyin day Korea was to have a consul-general only, without treaty, envoy, or state letter.',
  ],
  s0214: [
    'On day gengchen, Left Censor-in-Chief Yang Ru was appointed minister to Russia, Austria, and Holland; Director Luo Fenglu minister to Britain, Italy, and Belgium; Huang Zunxian minister to Germany; and Wu Tingfang minister to the United States, Japan, and Peru.',
    'On gengchen day Yang Ru, Luo Fenglu, Huang Zunxian, and Wu Tingfang were named ministers to various Western powers.',
  ],
  s0215: [
    'On day guiwei, autumn grain tax and miscellaneous levies were remitted in Wuding and other counties.',
    'On guiwei day Wuding and other counties were exempted autumn tax and levies.',
  ],
  s0216: [
    'On day yiyou, flood relief was granted in Huazhou and other places.',
    'On yiyou day Huazhou and other flood districts were relieved.',
  ],
  s0217: [
    'On day jichou, Xu Tong was made Grand Secretary of the Tiren Pavilion and Li Hongzao associate grand secretary while Minister of Rites.',
    'On jichou day Xu Tong became Tiren Pavilion grand secretary and Li Hongzao an associate grand secretary.',
  ],
  s0218: [
    'Eleventh month, day wushen: the winter solstice; Heaven was worshipped at the Circular Mound.',
    'In month 11, wushen day, the winter solstice sacrifice was held at the Circular Mound.',
  ],
  s0219: [
    'On day jiyou, court congratulations were waived.',
    'On jiyou day congratulatory audiences were waived.',
  ],
  s0220: [
    'On day xinhai, taxes and levies were remitted in flood-stricken He and Tao districts.',
    'On xinhai day He and Tao flood districts were exempted taxes.',
  ],
  s0221: [
    'On day dingsi, Works Vice Minister Xu Jingcheng was appointed minister to Germany.',
    'On dingsi day Xu Jingcheng was made envoy to Germany.',
  ],
  s0222: [
    'That month, flood relief was granted in Shandong and Sichuan.',
    'That month Shandong and Sichuan flood victims were relieved.',
  ],
  s0223: [
    'Twelfth month, day yichou, at first: Lu Chuanlin had repeatedly memorialized that Dartsedo should be attacked and afterward replaced with Han officials.',
    'In month 12, yichou day, Lu Chuanlin had long urged attacking Dartsedo and replacing it with Han officials.',
  ],
  s0224: [
    'The emperor, fearing to lose the Dalai Lama\'s goodwill, ordered Lu Chuanlin, Wen Hai, and others to deliberate in detail.',
    'The emperor, fearing to alienate the Dalai, ordered Lu Chuanlin and Wen Hai to study the matter.',
  ],
  s0225: [
    'By now they memorialized that the Dartsedo people were turning toward civilization and the Tibetan tribes were awed.',
    'They now reported Dartsedo people receptive and Tibetans intimidated.',
  ],
  s0226: [
    'Therefore the court earnestly instructed them to persuade the Dalai Lama so that protecting Tibet and protecting Sichuan would both proceed without obstruction.',
    'The court therefore urged earnest persuasion of the Dalai so Tibet and Sichuan could both be secured.',
  ],
  s0227: [
    'Disaster relief was granted in Dongxiang and other subordinate districts of Sichuan.',
    'Sichuan\'s Dongxiang and other districts received disaster relief.',
  ],
  s0228: [
    'On day bingzi, grain tax was remitted in Liaoyang village hamlets and overdue grain in Suide and other prefectures.',
    'On bingzi day Liaoyang villages and Suide arrears were forgiven.',
  ],
  s0229: [
    'Twenty-third year, spring, first month, new moon on day xinmao: banquets were suspended.',
    'In year 23, month 1, xinmao new moon, banquets were stopped.',
  ],
  s0230: [
    'On day dingyou, overdue taxes from the early Guangxu years in Shandong were remitted.',
    'On dingyou day Shandong\'s early Guangxu arrears were forgiven.',
  ],
  s0231: [
    'On day xinhai, Hubei canal grain was retained for work relief.',
    'On xinhai day Hubei canal grain was kept for work relief.',
  ],
  s0232: [
    'On day yimao, envoys of the United States, France, Britain, Germany, Holland, Belgium, Russia, Italy, Japan, and Austria were received at Wenhua Hall.',
    'On yimao day envoys of many Western powers were received at Wenhua Hall.',
  ],
  s0233: [
    'Second month, day renxu: Revenue Vice Minister Zhang Yinhuai was appointed envoy to Britain.',
    'In month 2, renxu day, Zhang Yinhuai was made envoy to Britain.',
  ],
  s0234: [
    'On day gengwu, the Yellow River burst at Licheng and Zhangqiu.',
    'On gengwu day the Yellow River broke at Licheng and Zhangqiu.',
  ],
  s0235: [
    'On day jimao, Chongli and Xu Yingkui were ordered to serve at the Zongli Yamen.',
    'On jimao day Chongli and Xu Yingkui joined the Zongli Yamen.',
  ],
  s0236: [
    'Third month, day guisi: an edict ordered redundant troops cut.',
    'In month 3, guisi day, an edict culled redundant troops.',
  ],
  s0237: [
    'On day jiachen, an empress dowager edict released 100,000 taels from the inner treasury for Sichuan relief and 50,000 for Hubei, and 100,000 from the state treasury was added for the Kui, Sui, and Zhong subprefectures of Sichuan.',
    'On jiachen day Cixi allotted inner funds for Sichuan and Hubei and added treasury silver for three Sichuan districts.',
  ],
  s0238: [
    'On day xinhai, land tax on flooded fields in Tongren and Qingxi was remitted.',
    'On xinhai day Tongren and Qingxi flooded land tax was forgiven.',
  ],
  s0239: [
    'On day dingsi, sea-cucumber commissioners were first established.',
    'On dingsi day sea-cucumber commissioners were first appointed.',
  ],
  s0240: [
    'Summer, fourth month, day yihai: Li Bingheng memorialized reducing Shandong money and grain taxes.',
    'In summer, month 4, yihai day, Li Bingheng asked to cut Shandong money and grain levies.',
  ],
  s0241: [
    'Fifth month, day bingshen: an edict approved the reincarnation of the Kunka Lama Jambatob as Hutuktu of the Chenghua Monastery at Bayin Gol.',
    'In month 5, bingshen day, a Hutuktu reincarnation at Bayin Gol was confirmed.',
  ],
  s0242: [
    'On day jiachen, Zhang Zhiwan died and was posthumously made Grand Tutor.',
    'On jiachen day Zhang Zhiwan died and received the posthumous rank Grand Tutor.',
  ],
  s0243: [
    'On day dingwei, the emperor visited the tomb of his biological mother, the consort of Prince Chunxian, and completed the first anniversary mourning.',
    'On dingwei day the emperor observed the first anniversary at his birth mother\'s tomb.',
  ],
  s0244: [
    'On day renzi, Lü Haihuan was given fourth-rank capital official rank and appointed minister to Germany and Holland.',
    'On renzi day Lü Haihuan was made envoy to Germany and Holland.',
  ],
  s0245: [
    'Sixth month, day jimao: flood relief was granted in Chongyang and other counties.',
    'In month 6, jimao day, Chongyang and other counties were relieved.',
  ],
  s0246: [
    'That summer, the Austrian envoy Qigan, the Russian envoy Urtamuskov, the British envoy MacDonald, and the Japanese envoy Yano Fumio were received at Wenhua Hall.',
    'That summer Austrian, Russian, British, and Japanese envoys were received at Wenhua Hall.',
  ],
  s0247: [
    'Autumn, seventh month, day gengyin: Li Hongzao died.',
    'In autumn, month 7, gengyin day, Li Hongzao died.',
  ],
  s0248: [
    'On day bingshen, Liao Shouheng was ordered to serve at the Zongli Yamen.',
    'On bingshen day Liao Shouheng joined the Zongli Yamen.',
  ],
  s0249: [
    'On day xinchou, former Shaanxi Guyuan commander Lei Zhengzhuan was restored to his original post.',
    'On xinchou day Lei Zhengzhuan regained his former Guyuan command.',
  ],
  s0250: [
    'On day jiachen, the mule tribute from the twenty-four monasteries of Minzhou Guard was remitted and the horse tribute deadline was extended.',
    'On jiachen day Minzhou\'s twenty-four monasteries were exempted mule tribute and horse tribute was deferred.',
  ],
  s0251: [
    'On day jiayin, a mountain at Putong village in Pingyao sank into the ground.',
    'On jiayin day a Pingyao mountain collapsed into a pit.',
  ],
  s0252: [
    'Eighth month, day jisi: an earthquake struck Jingxi.',
    'In month 8, jisi day, Jingxi was shaken by an earthquake.',
  ],
  s0253: [
    'On day renshen, Weng Tonghe was made associate grand secretary while Minister of Revenue.',
    'On renshen day Weng Tonghe became an associate grand secretary.',
  ],
  s0254: [
    'On day guiwei, the mining ban at Baerji in Zakhchin of Kobdo was lifted and Mongol and Han subjects were allowed to mine.',
    'On guiwei day Kobdo\'s Baerji mines were opened to Mongol and Han miners.',
  ],
  s0255: [
    'On day yiyou, because Lu Chuanlin had mishandled the Dergete native chieftain, the plan to replace native rule with regular administration was abandoned; the chieftain Angong Jiangbairenjing and his family were released and returned to govern Dergete.',
    'On yiyou day Lu Chuanlin\'s Dergete errors ended gaitu guiliu; Angong Jiangbairenjing resumed native rule.',
  ],
  s0256: [
    'Ninth month, day wuzi: Lu Chuanlin was dismissed.',
    'In month 9, wuzi day, Lu Chuanlin was removed.',
  ],
  s0257: [
    'On day jichou, troops were ordered withdrawn from Dergete.',
    'On jichou day Dergete troops were recalled.',
  ],
  s0258: [
    'On day wuxu, the Norwegian envoy Berg was received at Wenhua Hall.',
    'On wuxu day the Norwegian envoy Berg was received at Wenhua Hall.',
  ],
  s0259: [
    'On day jiachen, the Dalai Lama requested the return of Dartsedo lands.',
    'On jiachen day the Dalai asked for Dartsedo back.',
  ],
  s0260: [
    'An edict ordered Gong Shou and others to consult and report.',
    'Gong Shou and others were told to consult and report.',
  ],
  s0261: [
    'On day bingwu, the Lijin breach was closed.',
    'On bingwu day the Lijin breach was sealed.',
  ],
  s0262: [
    'On day yimao, former Shaanxi-Gansu governor-general Yang Changjun was restored to office.',
    'On yimao day Yang Changjun regained his former Shaanxi-Gansu post.',
  ],
  s0263: [
    'That autumn, hail and flood relief was granted in Shaanxi; flood relief in Hunan, Hubei, Jiangxi, Guangdong, Anhui, Yunnan, and Guizhou; and locust relief in Xinjiang.',
    'That autumn many provinces received hail, flood, and locust relief.',
  ],
  s0264: [
    'Tenth month, day wuwu: Guangxi Governor Shi Nianzu was dismissed for an offense.',
    'In month 10, wuwu day, Shi Nianzu lost the Guangxi governorship.',
  ],
  s0265: [
    'On day renshen, bandits in Caozhou killed German missionaries; Li Bingheng was ordered to investigate.',
    'On renshen day Caozhou bandits killed German missionaries and Li Bingheng was sent to investigate.',
  ],
  s0266: [
    'On day wuyin, Germany sent warships into Jiaozhou Bay.',
    'On wuyin day German warships entered Jiaozhou Bay.',
  ],
  s0267: [
    'On day renwu, assessed taxes were remitted in Leting and other disaster counties.',
    'On renwu day Leting and other disaster counties were exempted taxes.',
  ],
  s0268: [
    'That month, wind-disaster relief was granted in Guangdong, hail relief in Shaanxi, and flood relief in Hunan and Jiangnan.',
    'That month Guangdong, Shaanxi, Hunan, and Jiangnan disaster victims were relieved.',
  ],
  s0269: [
    'Eleventh month, day xinmao: 30,000 shi of Jiangbei canal grain was allocated for relief in Xu and Hai districts.',
    'In month 11, xinmao day, 30,000 shi of Jiangbei grain was set aside for Xu and Hai relief.',
  ],
  s0270: [
    'On day jiawu, an edict abolished the plan to replace the three Samsan districts with regular administration; they remained under the Dalai Lama.',
    'On jiawu day Samsan gaitu guiliu was dropped and the lands stayed under the Dalai.',
  ],
  s0271: [
    'On day xinchou, an edict ordered the starving people of Jiangsu subordinates comforted.',
    'On xinchou day Jiangsu famine victims were to be comforted.',
  ],
  s0272: [
    'On day dingwei, the British envoy MacDonald had an audience.',
    'On dingwei day MacDonald was received in audience.',
  ],
  s0273: [
    'On day guichou, the winter solstice; Heaven was worshipped at the Circular Mound.',
    'On guichou day the winter solstice sacrifice was held at the Circular Mound.',
  ],
  s0274: [
    'On day jiayin, court congratulations were waived.',
    'On jiayin day congratulatory audiences were waived.',
  ],
  s0275: [
    'Bandits in the Zhaowuda League banners were pacified.',
    'Zhaowuda league bandits were put down.',
  ],
  s0276: [
    'Twelfth month, day jiazi: the Lijin River burst.',
    'In month 12, jiazi day, the Lijin River broke.',
  ],
  s0277: [
    'On day jisi, rent on waterlogged land in Anzhou was remitted.',
    'On jisi day Anzhou flooded land rent was forgiven.',
  ],
  s0278: [
    'On day yihai, wild tribes of Sanyan submitted; a native thousand-household post was established under Batang.',
    'On yihai day Sanyan tribes submitted and a native chief was set under Batang.',
  ],
  s0279: [
    'Plans to replace the Zhuzhuo and Zhanggu native chieftains with regular administration were abandoned.',
    'Zhuzhuo and Zhanggu gaitu guiliu plans were dropped.',
  ],
  s0280: [
    'On day wuyin, an edict ordered every province to protect churches and missionaries.',
    'On wuyin day provinces were told to protect churches and missionaries.',
  ],
  s0281: [
    'Assessed taxes were remitted in Didao, Bayan Rongge, and other places.',
    'Didao, Bayan Rongge, and other districts were exempted taxes.',
  ],
  s0282: [
    'Twenty-fourth year, spring, first month, new moon on day yiyou: there was a solar eclipse.',
    'In year 24, month 1, yiyou new moon, a solar eclipse occurred.',
  ],
  s0283: [
    'New Year congratulations were moved to the Qianqing Palace and the clan banquet was suspended.',
    'New Year rites moved to the Qianqing Palace and the clan feast was canceled.',
  ],
  s0284: [
    'On day wuzi, an edict ordered provincial governors to devise plans for raising funds and drilling troops and report quickly.',
    'On wuzi day governors were told to plan revenue and training and report soon.',
  ],
  s0285: [
    'On day gengyin, special economic examinations and an annual recommendation system were established.',
    'On gengyin day special economic exams and annual recommendations were instituted.',
  ],
  s0286: [
    'Inside and outside the court were ordered to recommend men fit for the special examination.',
    'Court and provinces were told to recommend candidates for the special exam.',
  ],
  s0287: [
    'On day yiwei, summer grain tax was remitted in drought-stricken Jianshui.',
    'On yiwei day Jianshui drought districts were exempted summer grain.',
  ],
  s0288: [
    'On day jiyou, envoys of various countries were received at Wenhua Hall.',
    'On jiyou day foreign envoys were received at Wenhua Hall.',
  ],
  s0289: [
    'On day renzi, summer grain tax was remitted in Shiping and Kunming.',
    'On renzi day Shiping and Kunming summer grain was forgiven.',
  ],
  s0290: [
    'Second month, day jiazi: Liao Shouheng was ordered to study while serving above the Grand Council.',
    'In month 2, jiazi day, Liao Shouheng was told to learn on the Grand Council.',
  ],
  s0291: [
    'On day bingyin, horse-tribute silver for the Alirik tribes of Qinghai was remitted.',
    'On bingyin day Qinghai Alirik horse tribute silver was forgiven.',
  ],
  s0292: [
    'On day yisi, 10,000 shi of Jiangbei canal grain was retained to relieve the disaster in Xuzhou.',
    'On yisi day 10,000 shi of Jiangbei grain was kept for Xuzhou relief.',
  ],
  s0293: [
    'On day dingchou, the Shenji Camp was ordered to select and drill a vanguard corps.',
    'On dingchou day the Shenji Camp was told to train a vanguard unit.',
  ],
  s0294: [
    'On day gengchen, an edict changed the military examination to firearms and cannon and ended copying military classics from memory.',
    'On gengchen day the military exam tested guns and dropped memorized classics.',
  ],
  s0295: [
    'Third month, day dinghai: an edict ordered charity granaries established.',
    'In month 3, dinghai day, an edict set up charity granaries.',
  ],
  s0296: [
    'On day wuzi, the Russian envoy Pavlov was received in audience.',
    'On wuzi day the Russian envoy Pavlov had an audience.',
  ],
  s0297: [
    'On day yisi, assessed taxes were remitted in flood-stricken Xinhua.',
    'On yisi day Xinhua flood taxes were forgiven.',
  ],
  s0298: [
    'That month, treaty ports were opened from Beidaihe in Zhili to Qinhuangdao, Yuezhou in Hunan, and Sandu Ao in Fujian.',
    'That month Beidaihe-Qinhuangdao, Yuezhou, and Sandu Ao were opened as ports.',
  ],
  s0299: [
    'Intercalary third month, day yimao: Zhang Zhidong was summoned to the capital.',
    'In intercalary month 3, yimao day, Zhang Zhidong was called to Beijing.',
  ],
  s0300: [
    'On day bingchen, Lin Shu died.',
    'On bingchen day Lin Shu died.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b03.mjs <translation.json>'
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
