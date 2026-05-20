#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'In the twenty-sixth year, gengzi, spring, first month, first day jiachen new moon: an edict ordered added favors for collateral princes and close ministers on the thirty-day birthday celebration.',
    'In year 26, gengzi spring, month 1 day jiachen new moon, the court added favors for princes and close ministers for the thirty-day birthday.',
  ],
  s0602: [
    'On day jiyou, Prince Chun Zai Feng was ordered on duty in the inner court, and Hanlin expositor Bao Feng on duty at the Hall of Manifest Virtue.',
    'On jiyou day, Zai Feng of Prince Chun was posted to the inner court and expositor Bao Feng to Hongde Hall.',
  ],
  s0603: [
    'Autumn executions this year were suspended.',
    'This year\'s autumn executions were halted.',
  ],
  s0604: [
    'On day renzi, earlier the prefect Jing Yuanshan had joined others in a memorial advising against establishing an heir.',
    'On renzi day, earlier prefect Jing Yuanshan had memorialized against naming an heir.',
  ],
  s0605: [
    'Now an edict ordered his strict arrest and punishment, and soon his family property was confiscated.',
    'Now he was ordered seized and punished, and his estate was soon confiscated.',
  ],
  s0606: [
    'On day wuzi, an edict ordered a great search for Kang Youwei and Liang Qichao, destruction of their writings, and punishment for anyone who read their newspapers.',
    'On wuzi day, Kang Youwei and Liang Qichao were hunted, their books destroyed, and readers of their papers punished.',
  ],
  s0607: [
    'On day renxu, the Sanyan tribes were pacified and additional native-official posts were set up at Batang and elsewhere.',
    'On renxu day, the Sanyan tribes submitted and more native officials were appointed at Batang and elsewhere.',
  ],
  s0608: [
    'On day guihai, the Yamen negotiated a lease of Guangzhou Bay with France for ninety-nine years.',
    'On guihai day, the Yamen agreed a ninety-nine-year lease of Guangzhou Bay with France.',
  ],
  s0609: [
    'On day jiazi, thirty thousand shi of southern grain tribute were retained to relieve flood victims in Hebei.',
    'On jiazi day, thirty thousand shi of southern tribute grain were kept for Hebei flood relief.',
  ],
  s0610: [
    'That month Boxer bands rose in Shandong, calling themselves the "Righteous Harmony Fist Society," using hatred of Christianity as a pretext; robbery and killing followed one upon another and harm spread.',
    'That month Boxers rose in Shandong as the "Righteous Harmony Fist Society," using anti-Christianity as a cover for robbery and killing that spread.',
  ],
  s0611: [
    'Second month, day bingzi: the Yellow River burst at Binzhou.',
    'Month 2, bingzi: the Yellow River broke at Binzhou.',
  ],
  s0612: [
    'On day yiyou, assessed taxes were remitted for Kunming and other flood-stricken districts.',
    'On yiyou day, taxes were remitted for Kunming and other flooded districts.',
  ],
  s0613: [
    'On day wuxu, the treaty with Mexico was fixed.',
    'On wuxu day, the Mexican treaty was settled.',
  ],
  s0614: [
    'Third month, day wushen: Li Shengduo was appointed envoy to Japan to congratulate the crown prince on his marriage;',
    'Month 3, wushen: Li Shengduo was sent to Japan to congratulate the crown prince\'s marriage;',
  ],
  s0615: [
    'Lü Haihuan was appointed envoy to Germany to congratulate the crown prince on coming of age.',
    'and Lü Haihuan to Germany for the crown prince\'s coming of age.',
  ],
  s0616: [
    'On day renzi, the Binzhou breach was closed.',
    'On renzi day, the Binzhou breach was sealed.',
  ],
  s0617: [
    'On day guichou, because of drought an edict ordered consideration of prisoners at home and abroad.',
    'On guichou day, drought led to orders to review prisoners at home and abroad.',
  ],
  s0618: [
    'On day jiayin, Gao Geng\'en was rewarded with fourth-rank Beijing office and posted to the Hall of Manifest Virtue.',
    'On jiayin day, Gao Geng\'en was given fourth-rank Beijing office and posted to Hongde Hall.',
  ],
  s0619: [
    'On day dingsi, Grand Secretary Guichun was appointed envoy to Russia and soon also envoy to Austria.',
    'On dingsi day, Guichun was made envoy to Russia and soon also to Austria.',
  ],
  s0620: [
    'One hundred thousand taels from the ministry treasury were allocated to relieve floods in Shandong and Guizhou.',
    'One hundred thousand taels were sent to relieve floods in Shandong and Guizhou.',
  ],
  s0621: [
    'On day jiwei, the Jingyuan tribes submitted and native-official posts were set for the various tribes.',
    'On jiwei day, the Jingyuan tribes submitted and native officials were appointed.',
  ],
  s0622: [
    'On day renxu, Yuan Shikai was ordered to gather twenty new battalions, add a new army, named the Vanguard of the Right Division of the Martial Guards.',
    'On renxu day, Yuan Shikai was told to raise twenty new battalions as the Vanguard of the Right Martial Guard Army.',
  ],
  s0623: [
    'Summer, fourth month, day yiyou: Shanlian was dismissed and Xu Yingkui was put in charge of the shipping administration as well.',
    'Summer month 4, yiyou: Shanlian left office and Xu Yingkui also took charge of shipping.',
  ],
  s0624: [
    'On day gengyin, the Boxer Fist entered the capital; an edict ordered the metropolitan infantry commander and others to confer on defense and report.',
    'On gengyin day, Boxers entered Beijing and the infantry commander and others were told to plan defense.',
  ],
  s0625: [
    'On day xinmao, autumn grain tax was remitted for Xuanwei and Songming, which had suffered flood.',
    'On xinmao day, autumn tax was remitted for flood-hit Xuanwei and Songming.',
  ],
  s0626: [
    'On day bingshen, flood and drought relief was given for Chongqing and other places.',
    'On bingshen day, Chongqing and elsewhere received flood and drought relief.',
  ],
  s0627: [
    'On day dingyou, the Yamen said the Fist Society spread rumors and stirred people so minds were unsettled and trouble was easy to start.',
    'On dingyou day, the Yamen warned that the Boxers spread rumors, unsettled the people, and invited trouble.',
  ],
  s0628: [
    'They were instructed to deliberate properly.',
    'Officials were told to deliberate properly.',
  ],
  s0629: [
    'Li Hongzhang was appointed governor-general of Guangdong and Guangxi.',
    'Li Hongzhang became governor-general of the two Guangs.',
  ],
  s0630: [
    'On day gengzi, assessed taxes were remitted for Xinhua and other flood-stricken districts.',
    'On gengzi day, taxes were remitted for flooded Xinhua and other districts.',
  ],
  s0631: [
    'That month Boxer bands burned the Baoding railway; Vice Commander Yang Futong went to suppress them and was killed at Lishui on the way.',
    'That month Boxers burned the Baoding railway; Vice Commander Yang Futong was killed at Lishui while going to suppress them.',
  ],
  s0632: [
    'Fifth month, day guimao: Boxer bands destroyed the Liulihe and Changxindian stations and works.',
    'Month 5, guimao: Boxers destroyed Liulihe and Changxindian stations and works.',
  ],
  s0633: [
    'Nie Shicheng was ordered to guard the Lubaoding and Tianjin-Lubaoding routes and defend them.',
    'Nie Shicheng was ordered to guard and defend the Lubaoding and Tianjin-Lubaoding lines.',
  ],
  s0634: [
    'On day jiayin, Zai Yi was put in charge of the Zongli Yamen; Qixiu, Pu Xing, and Natong were also made acting members, and Liao Shouheng was dismissed.',
    'On jiayin day, Zai Yi headed the Zongli Yamen; Qixiu, Pu Xing, and Natong joined as acting members and Liao Shouheng left.',
  ],
  s0635: [
    'On day yimao, Boxer bands killed the Japanese legation secretary Sugiyama outside Yongding Gate.',
    'On yimao day, Boxers killed Japanese legation secretary Sugiyama outside Yongding Gate.',
  ],
  s0636: [
    'On day dingsi, Ma Yugui was ordered to the western capital suburbs to suppress Boxer bands.',
    'On dingsi day, Ma Yugui was sent west of the capital to suppress Boxers.',
  ],
  s0637: [
    'Dagu was placed under martial law.',
    'Dagu went on alert.',
  ],
  s0638: [
    'On day jiwei, Boxer bands disturbed the five wards; markets ran with blood.',
    'On jiwei day, Boxers disturbed the five wards and blood flowed in the markets.',
  ],
  s0639: [
    'An edict ordered the metropolitan infantry commander, the Divine Engine Corps, the Tiger God Corps, and the central Martial Guard to patrol jointly; grand ministers to inspect streets; and detachments at the nine gates to supervise opening and closing.',
    'The infantry commander, Divine Engine, Tiger God, and central Martial Guard were ordered to patrol; ministers to inspect streets; and detachments to guard the nine gates.',
  ],
  s0640: [
    'Li Hongzhang and Yuan Shikai were summoned to guard the capital.',
    'Li Hongzhang and Yuan Shikai were called to guard the capital.',
  ],
  s0641: [
    'On day gengshen, Ronglu used the central Martial Guard to protect the legations of all nations.',
    'On gengshen day, Ronglu used the central Martial Guard to protect foreign legations.',
  ],
  s0642: [
    'Li Duanyu and Wang Yirong were appointed metropolitan militia grand ministers.',
    'Li Duanyu and Wang Yirong became capital militia grand ministers.',
  ],
  s0643: [
    'Li Bingheng and Ma Yugui were summoned with their armies to the capital.',
    'Li Bingheng and Ma Yugui were called to the capital with their troops.',
  ],
  s0644: [
    'That evening Boxer bands burned the Zhengyang Gate tower; lanes and markets were ash.',
    'That night Boxers burned Zhengyang Gate tower and lanes and markets to ash.',
  ],
  s0645: [
    'On day gengshen, an edict ordered Gang Yi and Dong Fuxiang to enlist sturdy Boxer men as troops and disperse the rest.',
    'On gengshen day, Gang Yi and Dong Fuxiang were told to enlist sturdy Boxers as troops and disperse the rest.',
  ],
  s0646: [
    'On day xinyou, an edict ordered each province to send troops to guard the capital.',
    'On xinyou day, provinces were told to send troops to guard the capital.',
  ],
  s0647: [
    'Foreign troops attacked Dagu; Admiral Luo Rongguang could not hold them, fled to Tianjin, and died; Dagu then fell.',
    'Foreign troops took Dagu; Admiral Luo Rongguang could not hold, fled to Tianjin and died, and Dagu fell.',
  ],
  s0648: [
    'Yu Lu reported victory; an edict issued one hundred thousand taels from the privy purse to reward the army.',
    'Yu Lu reported victory and one hundred thousand taels from the privy purse were issued to reward troops.',
  ],
  s0649: [
    'On day renxu, Xu Tong and Chongqi were ordered to confer with Prince Qing, Zai Lian, and others on military affairs.',
    'On renxu day, Xu Tong and Chongqi were told to confer with Prince Qing, Zai Lian, and others on military affairs.',
  ],
  s0650: [
    'On day guihai, Xu Jingcheng and Natong were ordered to tell the ministers of all nations to leave the capital quickly.',
    'On guihai day, Xu Jingcheng and Natong were sent to tell foreign ministers to leave Beijing quickly.',
  ],
  s0651: [
    'From gengshen until this day the empress dowager repeatedly summoned princes and grand ministers to consult public opinion.',
    'From gengshen until then the empress dowager repeatedly summoned princes and ministers for counsel.',
  ],
  s0652: [
    'Zai Yi held firmly to war.',
    'Zai Yi strongly favored war.',
  ],
  s0653: [
    'Zai Xun, Zai Lian, Zai Lan, Xu Tong, Chongqi, Qixiu, Pu Liang, Xu Chengyu, and others echoed one another.',
    'Zai Xun, Zai Lian, Zai Lan, Xu Tong, Chongqi, Qixiu, Pu Liang, Xu Chengyu, and others echoed him.',
  ],
  s0654: [
    'Ronglu wavered between them.',
    'Ronglu wavered between the factions.',
  ],
  s0655: [
    'Only Xu Jingcheng and Yuan Chong said the bands should be suppressed, trouble must not be opened, and killing envoys violated public law; their words were especially blunt.',
    'Only Xu Jingcheng and Yuan Chong said Boxers must be suppressed, war must not start, and killing envoys broke international law, in blunt terms.',
  ],
  s0656: [
    'Hence this order.',
    'Hence the order to envoys to leave.',
  ],
  s0657: [
    'On day jiazi, Boxer bands killed the German minister von Ketteler inside Chongwen Gate.',
    'On jiazi day, Boxers killed German minister von Ketteler inside Chongwen Gate.',
  ],
  s0658: [
    'On day yichou, an edict said trouble had begun at home and abroad and ordered war preparations.',
    'On yichou day, an edict cited trouble at home and abroad and ordered war preparations.',
  ],
  s0659: [
    'Chongli was dismissed as metropolitan infantry commander.',
    'Chongli left the metropolitan infantry command.',
  ],
  s0660: [
    'Zai Xun replaced him.',
    'Zai Xun replaced him.',
  ],
  s0661: [
    'Granary rice was released for sale to relieve the people\'s food shortage.',
    'Granary rice was sold cheap to feed the people.',
  ],
  s0662: [
    'On day gengwu, Lu Chuanlin was summoned to the capital.',
    'On gengwu day, Lu Chuanlin was summoned to the capital.',
  ],
  s0663: [
    'Sixth month, first day xinwei new moon: Shuntian and the five wards were told to sell grain cheap and bury the exposed corpses of murdered Christians.',
    'Month 6, xinwei new moon: Shuntian and the five wards were told to sell grain cheap and bury murdered Christians\' corpses.',
  ],
  s0664: [
    'On day guiyou, Vice Minister of the Granary Liu Enpu was sent to Tianjin to enlist sturdy water-guild men, organize them as troops with militia at Tongzhou, Wuqing, and Dong\'an stationed in Zhili, and supply them with pay and arms.',
    'On guiyou day, Liu Enpu went to Tianjin to enlist water-guild men as troops with Tongzhou, Wuqing, and Dong\'an militia in Zhili, with pay and arms.',
  ],
  s0665: [
    'Granaries at Tongzhou were opened for sale.',
    'Tongzhou granaries opened for cheap sale.',
  ],
  s0666: [
    'Chang Cui and others said the Tianjin route was blocked and asked to suspend grain transport temporarily; it was not allowed.',
    'Chang Cui and others asked to suspend grain transport because the Tianjin route was blocked; it was refused.',
  ],
  s0667: [
    'On day yihai, provinces were instructed to escort missionaries home; Christian converts who repented and surrendered might be pardoned.',
    'On yihai day, provinces were told to send missionaries home and pardon repentant converts.',
  ],
  s0668: [
    'On day jimao, southern grain transport was blocked; an office was set at Qingjiangpu to purchase grain for the capital.',
    'On jimao day, southern transport was blocked and Qingjiangpu was told to buy grain for Beijing.',
  ],
  s0669: [
    'On day renwu, Li Hongzhang was transferred to governor-general of Zhili and Grand Minister for the Northern Ocean and urged to come by forced marches.',
    'On renwu day, Li Hongzhang became Zhili governor-general and Northern Ocean minister and was urged to hurry to the capital.',
  ],
  s0670: [
    'On day yiyou, an edict postponed this year\'s grace-cycle provincial examinations to the eighth day of the third month next year and the metropolitan examinations to the eighth day of the eighth month; the regular gengzi cycle provincial and metropolitan examinations were deferred in turn.',
    'On yiyou day, this year\'s grace provincial exams were postponed to month 3 day 8 next year and metropolitan exams to month 8 day 8, with the regular gengzi cycle deferred in turn.',
  ],
  s0671: [
    'Foreign troops attacked Tianjin; Nie Shicheng fought at Balitai and died.',
    'Foreign troops attacked Tianjin; Nie Shicheng fought at Balitai and died.',
  ],
  s0672: [
    'On day wuzi, Lü Benyuan was made Zhili provincial commander.',
    'On wuzi day, Lü Benyuan became Zhili commander.',
  ],
  s0673: [
    'Tianjin fell; Yu Lu, Song Qing, and Ma Yugui all withdrew to Beicang.',
    'Tianjin fell and Yu Lu, Song Qing, and Ma Yugui withdrew to Beicang.',
  ],
  s0674: [
    'On day gengyin, Gu Huang and Zhang Renqi were ordered to manage Henan militia defense jointly.',
    'On gengyin day, Gu Huang and Zhang Renqi jointly managed Henan militia defense.',
  ],
  s0675: [
    'Minister of Revenue Li Shan was imprisoned.',
    'Revenue Minister Li Shan was jailed.',
  ],
  s0676: [
    'On day xinmao, an edict ordered pursuit of the murderers of the German minister.',
    'On xinmao day, murderers of the German minister were ordered seized.',
  ],
  s0677: [
    'E-lehebu died.',
    'E-lehebu died.',
  ],
  s0678: [
    'On day bingshen, on the thirty-day birthday the Donghua Gate was not opened; all court congratulations entered by the Divine Might Gate.',
    'On bingshen day, for the thirty-day birthday Donghua Gate stayed shut and congratulations entered by Shenwu Gate.',
  ],
  s0679: [
    'Assessed taxes were remitted for Shufu and Baicheng, which had suffered disaster.',
    'Taxes were remitted for disaster-hit Shufu and Baicheng.',
  ],
  s0680: [
    'Fujian flood victims received relief.',
    'Fujian flood victims were relieved.',
  ],
  s0681: [
    'Autumn, seventh month, first day gengzi new moon: Li Bingheng was ordered to assist in Martial Guard affairs; Zhang Chunfa, Chen Zelin, Wan Benhua, and Xia Xinyu and their armies were all placed under his command.',
    'Month 7, gengzi new moon: Li Bingheng assisted Martial Guard affairs; Zhang Chunfa, Chen Zelin, Wan Benhua, and Xia Xinyu\'s armies obeyed him.',
  ],
  s0682: [
    'On day renyin, Vice Minister of Personnel Xu Jingcheng and Court of Sacrifices Minister Yuan Chong were executed.',
    'On renyin day, Xu Jingcheng and Yuan Chong were executed.',
  ],
  s0683: [
    'On day yisi, Ma Yugui was transferred to Zhili provincial commander.',
    'On yisi day, Ma Yugui became Zhili commander.',
  ],
  s0684: [
    'On day dingwei, Ronglu was ordered to escort the ministers of all nations to Tianjin with troops.',
    'On dingwei day, Ronglu was told to escort foreign ministers to Tianjin with troops.',
  ],
  s0685: [
    'On day jiyou, foreign troops held Beicang.',
    'On jiyou day, foreign troops held Beicang.',
  ],
  s0686: [
    'On day gengxu, Yangcun fell; Zhili governor-general Yu Lu killed himself.',
    'On gengxu day, Yangcun fell and Zhili governor Yu Lu killed himself.',
  ],
  s0687: [
    'On day renzi, Li Hongzhang was given full powers as plenipotentiary to negotiate a truce with the various nations.',
    'On renzi day, Li Hongzhang was given full powers to negotiate a truce with the powers.',
  ],
  s0688: [
    'Foreign troops attacked Caicun.',
    'Foreign troops attacked Caicun.',
  ],
  s0689: [
    'On day guichou, Li Bingheng fought at Caicun and was defeated.',
    'On guichou day, Li Bingheng fought at Caicun and was defeated.',
  ],
  s0690: [
    'Foreign troops advanced and occupied Hexiwu.',
    'Foreign troops took Hexiwu.',
  ],
  s0691: [
    'On day jiayin, Zeng Qi reported that Gaiping and Xiongyue had successively fallen.',
    'On jiayin day, Zeng Qi reported Gaiping and Xiongyue had fallen in turn.',
  ],
  s0692: [
    'On day bingchen, Revenue Minister Li Shan, War Minister Xu Yongyi, and Grand Secretary Lian Yuan were executed.',
    'On bingchen day, Li Shan, Xu Yongyi, and Lian Yuan were executed.',
  ],
  s0693: [
    'Li Bingheng was defeated at Zhangjiawan and died.',
    'Li Bingheng was defeated at Zhangjiawan and died.',
  ],
  s0694: [
    'On day dingsi, foreign troops took Tongzhou.',
    'On dingsi day, foreign troops took Tongzhou.',
  ],
  s0695: [
    'Gang Yi was ordered to assist in Martial Guard affairs.',
    'Gang Yi was ordered to assist Martial Guard affairs.',
  ],
  s0696: [
    'On day jiwei, allied troops of Germany, Austria, America, France, Britain, Italy, Japan, and Russia took the capital.',
    'On jiwei day, the eight-power allied army took Beijing.',
  ],
  s0697: [
    'On day gengshen, the emperor accompanied the empress dowager to Taiyuan; the traveling palace was at Guanshi.',
    'On gengshen day, the emperor followed the empress dowager to Taiyuan; the court was at Guanshi.',
  ],
  s0698: [
    'On day renxu, they stopped at Huailai.',
    'On renxu day, they halted at Huailai.',
  ],
  s0699: [
    'Ronglu, Xu Tong, and Chongqi were ordered to remain in the capital to handle affairs.',
    'Ronglu, Xu Tong, and Chongqi were left in Beijing to handle affairs.',
  ],
  s0700: [
    'On day guihai, Guangdong provincial administration commissioner Cen Chunxuan led troops to guard the court and was then ordered to accompany the imperial procession.',
    'On guihai day, Cen Chunxuan of Guangdong led troops to guard the court and was ordered to join the flight.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b07.mjs <translation.json>'
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
