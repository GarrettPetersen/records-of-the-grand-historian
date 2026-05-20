#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'The Emperor Dezong, entitled Tongtian Chongyun Dazhong Zhizheng Jingwen Weiwu Renxiao Ruizhi Duanjian Kuanqin Jing, taboo name Zaitian, was the adopted son of Emperor Wenzong and a cousin of Emperor Muzong.',
    'Emperor Dezong Jing—taboo Zaitian—was Wenzong\'s adopted heir and Muzong\'s cousin.',
  ],
  s0002: [
    'His biological father was Prince Chunxian Yixuan, the seventh son of Emperor Daoguang.',
    'His birth father was Prince Chunxian Yixuan, Daoguang\'s seventh son.',
  ],
  s0003: [
    'His biological mother was of the Yehe Nara clan, younger sister of Empress Dowager Cixi.',
    'His birth mother was Yehe Nara, Cixi\'s younger sister.',
  ],
  s0004: [
    'In the sixth month of the tenth year of Tongzhi, he was born at the residence on Tai Ping Lake.',
    'He was born at the Tai Ping Lake mansion in Tongzhi year 10, month 6.',
  ],
  s0005: [
    'In the thirteenth year, he received the stipend of an Assistant State Duke.',
    'In year 13 he drew an Assistant State Duke\'s stipend.',
  ],
  s0006: [
    'In the twelfth month, on day guiyou, Muzong died without an heir.',
    'On guiyou in month 12 Muzong died childless.',
  ],
  s0007: [
    'Empress Dowager Ci\'an and Empress Dowager Cixi summoned Prince Dun Yizhong, Prince Gong Yixin, Prince Chun Yixuan, Prince Fu Yixun, Prince Hui Yixiang, Prince Zai Cheng, Duke of the State Yimuo, together with grand councilors, Grand Council ministers, Board of Imperial Household ministers, and Hongde Hall and Southern Study scholars to decide; an imperial edict was transmitted that he should succeed Emperor Wenzong as son, enter to inherit the Great Lineage, and become the successor emperor.',
    'Ci\'an and Cixi called in the princes and senior ministers and, by edict, made him Wenzong\'s adopted son and heir to the throne.',
  ],
  s0008: [
    'When the successor emperor has a son, that son shall succeed the late emperor.',
    'When the new emperor had a son, that son would succeed the late Tongzhi.',
  ],
  s0009: [
    'On day yihai, the princes and ministers, by the late emperor\'s testament, welcomed him from his residence and he paid respects before the late emperor\'s bier.',
    'On yihai the princes brought him from his mansion by testament to mourn before the late emperor\'s coffin.',
  ],
  s0010: [
    'On day bingzi, the emperor installed Empress Dowager Ci\'an at Zhongcui Palace and Empress Dowager Cixi at Changchun Palace.',
    'On bingzi he lodged Ci\'an at Zhongcui and Cixi at Changchun.',
  ],
  s0011: [
    'At the request of the princes and ministers, both empress dowagers held court behind the curtain and governed.',
    'On the princes\' plea, both empresses dowager began regency from behind the curtain.',
  ],
  s0012: [
    'The empress dowagers\' instructions were styled Imperial Edicts; the emperor\'s were styled Imperial Rescripts.',
    'The dowagers\' orders read as edicts; the boy emperor\'s as rescripts.',
  ],
  s0013: [
    'An edict halted work on the Three Seas projects.',
    'Work on the Three Seas pleasure grounds was stopped.',
  ],
  s0014: [
    'On day yimao, tribute of local products from the provinces was halted.',
    'On yimao day provincial tribute gifts were suspended.',
  ],
  s0015: [
    'On day renwu, the late emperor\'s testament was promulgated.',
    'On renwu day the late emperor\'s death testament was issued.',
  ],
  s0016: [
    'By imperial edict, Prince Chun Yixuan was granted perpetual hereditary succession as prince.',
    'An edict made Prince Chun Yixuan\'s princedom hereditary in perpetuity.',
  ],
  s0017: [
    'Hanlin Academy Reader-in-Waiting Wang Qingqi was guilty and stripped of office.',
    'Reader Wang Qingqi was found guilty and dismissed.',
  ],
  s0018: [
    'Mourning dress was fixed: plain white for one hundred days, then plain dress for twenty-seven months.',
    'Mourning was set at one hundred days of white, then twenty-seven months of plain dress.',
  ],
  s0019: [
    'Bayan Nemeku and Jingshou were both put in charge of the Shenji Camp.',
    'Bayan Nemeku and Jingshou took joint command of the Shenji Camp.',
  ],
  s0020: [
    'On day guiwei, an edict ordered that memorials to Prince Dun, Prince Gong, and Prince Fu need not bear their names, that they be summoned to audience, granted banquets and gifts, and exempted from prostration.',
    'On guiwei day Prince Dun, Gong, and Fu were freed from naming themselves on memorials, from kowtow, and were summoned and feasted.',
  ],
  s0021: [
    'On day jiachen, an edict declared that the coming year would be the first year of Guangxu.',
    'On jiachen day the next year was proclaimed Guangxu year 1.',
  ],
  s0022: [
    'On day dinghai, the late emperor was given the posthumous title Jitian Kaiyun Shouzhong Juzheng Baoda Dinggong Shengzhi Cheng Xiao Xinmin Gong Kuan Yi Huangdi and the temple name Muzong.',
    'On dinghai day the late emperor received the posthumous title and temple name Muzong.',
  ],
  s0023: [
    'On day wuzi, by imperial edict the empress was ennobled as Empress Jishun and the imperial noble consort as Imperial Noble Consort Dunyi.',
    'On wuzi day the empress became Jishun and the chief consort Dunyi.',
  ],
  s0024: [
    'An edict told officials at home and abroad that in appointments and administration they should speak frankly according to fact.',
    'Officials were told to speak plainly on appointments and policy.',
  ],
  s0025: [
    'The people were admonished to abandon extravagance and honor what is real.',
    'Subjects were urged to shed luxury and value substance.',
  ],
  s0026: [
    'Each governor-general was ordered to seek the people\'s hardships, choose magistrates carefully, examine subordinate officials, and restore military readiness.',
    'Governors were told to learn local suffering, pick good magistrates, audit subordinates, and sharpen defenses.',
  ],
  s0027: [
    'On day renchen, the testament was promulgated in Korea.',
    'On renchen day the testament reached Korea.',
  ],
  s0028: [
    'On day jiawu, officials of the Board of Imperial Household were forbidden to curry favor with eunuchs.',
    'On jiawu day household officials were banned from bribing eunuchs.',
  ],
  s0029: [
    'On day yiwei, Board ministers Guibao and Wenxi were stripped of office.',
    'On yiwei day Guibao and Wenxi lost their household posts.',
  ],
  s0030: [
    'On day bingshen, Zuo Zongtang was ordered to supervise suppression of the rebellious Muslims at Hezhou.',
    'On bingshen day Zuo Zongtang was sent to crush the Hezhou Muslim rebels.',
  ],
  s0031: [
    'On day dingyou, joint seasonal sacrifices were offered at the Imperial Ancestral Temple.',
    'On dingyou day the Ancestral Temple received its joint seasonal rites.',
  ],
  s0032: [
    'That month, stove levies on disaster-stricken salt yards in Zhejiang were remitted.',
    'That month Zhejiang\'s storm-hit salt yards had stove taxes forgiven.',
  ],
  s0033: [
    'In the first year of Guangxu, yihai, spring, first month, new moon on day jihai: court congratulations were waived.',
    'Guangxu year 1, spring, month 1, new moon jihai: New Year levee was canceled.',
  ],
  s0034: [
    'Minister of Personnel Ying Gui and Minister of War Shen Guifen were both ordered to serve concurrently as Grand Secretary.',
    'Ying Gui and Shen Guifen were made concurrent grand secretaries.',
  ],
  s0035: [
    'On day wushen, the Ming loyalist Zheng Chenggong was granted a temple in Taiwan and posthumously ennobled as Loyal and Upright.',
    'On wushen day Zheng Chenggong got a Taiwan shrine and the posthumous name Loyal and Upright.',
  ],
  s0036: [
    'On day gengxu, Shen Baozhen was ordered to survey Langqiao, build a walled town, and plan opening mountains and pacifying the aborigines.',
    'On gengxu day Shen Baozhen was told to survey Langqiao, fortify a town, and pacify the tribes.',
  ],
  s0037: [
    'On day xinhai, prayer for grain was offered to the Supreme Lord.',
    'On xinhai day the court prayed for grain to Heaven.',
  ],
  s0038: [
    'A relief depot was set up on the Qing River to feed famine victims from Xu and Hai flooded by water.',
    'A Qing River depot took in flood-starved refugees from Xu and Hai.',
  ],
  s0039: [
    'Reader in the Grand Secretariat Guang An memorialized asking that court ministers meet to discuss succession to the late emperor and issuance of iron bonds; he was rebuked.',
    'Guang An asked the court to debate the late emperor\'s succession and 「iron bonds」; he was rebuked.',
  ],
  s0040: [
    'On day bingchen, Vietnamese bandits crossed into Yunnan; Governor Cen Yuying suppressed and pacified them; on day wuwu the emperor took the throne in the Hall of Supreme Harmony, issued an amnesty, and opened a grace examination.',
    'On bingchen Cen Yuying crushed Vietnamese raiders on the Yunnan border; on wuwu the boy took the throne, proclaimed amnesty, and opened a grace exam.',
  ],
  s0041: [
    'On day xinyou, governors-general were again instructed to advance the worthy and punish the greedy and to eliminate cronyism and scramble for favor.',
    'On xinyou day governors were again told to promote talent, punish graft, and end favor-trading.',
  ],
  s0042: [
    'Second month, day dingchou: the Ministry of Justice was ordered to clear accumulated cases.',
    'In month 2, dingchou, the Ministry of Justice was told to clear its backlog.',
  ],
  s0043: [
    'On day wuyin, the Grand Altars of Earth and Grain were sacrificed to; Prince Yu Benge performed the rite by proxy.',
    'On wuyin day Prince Yu Benge offered proxy sacrifice at the altars of Earth and Grain.',
  ],
  s0044: [
    'Henceforth major sacrifices were all performed by proxy; only in the twelfth year, at the winter solstice round-altar sacrifice to Heaven, did he go in person.',
    'From then on great rites were delegated until year 12, when he first attended the winter solstice Heaven sacrifice himself.',
  ],
  s0045: [
    'On day renwu, the British interpreter Margary was killed in Yunnan.',
    'On renwu day Britain\'s interpreter Margary was murdered in Yunnan.',
  ],
  s0046: [
    'Liu Jintang and others recovered Hezhou.',
    'Liu Jintang and others retook Hezhou.',
  ],
  s0047: [
    'On day jiashen, Taiwan aborigines rebelled; Military Commander Tang Dingkui suppressed them.',
    'On jiashen day Taiwan tribes rose and Tang Dingkui put them down.',
  ],
  s0048: [
    'On day bingxu, the king of Ryukyu was granted bolts of satin and brocade, and the tribute envoys satin bolts as well.',
    'On bingxu day Ryukyu\'s king and envoys received satin and brocade.',
  ],
  s0049: [
    'On day wuzi, Empress Jishun died.',
    'On wuzi day Empress Jishun died.',
  ],
  s0050: [
    'Third month, new moon on day wuxu: there was an eclipse of the sun.',
    'In month 3, new moon wuxu, the sun was eclipsed.',
  ],
  s0051: [
    'On day jihai, the late emperor\'s posthumous title and temple name were conferred.',
    'On jihai day the late emperor received his posthumous title and temple name.',
  ],
  s0052: [
    'On day renzi, the Jiazhuang river works in Shandong were joined.',
    'On renzi day Shandong\'s Jiazhuang river closure was completed.',
  ],
  s0053: [
    'On day bingchen, the Vietnamese bandit Su Yadeng and others were executed.',
    'On bingchen day the Vietnamese bandit Su Yadeng and his fellows were put to death.',
  ],
  s0054: [
    'On day yichou, Jing Lian was recalled to the capital; Zuo Zongtang was made Imperial Commissioner to supervise Xinjiang military affairs, with Jin Shun as Urumqi commander to assist him.',
    'On yichou day Jing Lian was recalled, Zuo Zongtang made Xinjiang commissioner, and Jin Shun his Urumqi deputy.',
  ],
  s0055: [
    'That month, overdue grain taxes were broadly remitted in all provinces; Jiangxi and Shanxi arrears before the sixth year of Tongzhi were forgiven.',
    'That month grain arrears were forgiven empire-wide, including Jiangxi and Shanxi debts before Tongzhi year 6.',
  ],
  s0056: [
    'Summer, fourth month, new moon on day dingmao: offerings were presented at the Imperial Ancestral Temple.',
    'In summer month 4, new moon dingmao, the Ancestral Temple received offerings.',
  ],
  s0057: [
    'On day gengwu, Mutu Shan was ordered to bring his cavalry to the capital, attach them to the Shenji Camp, and encamp them at the Southern Park.',
    'On gengwu day Mutu Shan\'s horse detachments came to Beijing, joined the Shenji Camp, and camped at Nan Yuan.',
  ],
  s0058: [
    'On day jimao, Tang Dingkui conquered the southern-route aboriginal villages of Taiwan.',
    'On jimao day Tang Dingkui took Taiwan\'s southern aboriginal villages.',
  ],
  s0059: [
    'On day renchen, Shen Baozhen was made Liangjiang governor-general, concurrently Superintendent of Trade, to supervise the Southern Seas coastal defense; Li Hongzhang supervised the Northern Seas coastal defense.',
    'On renchen day Shen Baozhen took Liangjiang and the southern coast while Li Hongzhang took the north.',
  ],
  s0060: [
    'Fifth month, day wuxu: Zhili waterworks were undertaken and garrison troops reclaimed saline fields at Gushui to plant rice.',
    'In month 5, wuxu, Zhili launched waterworks and troops reclaimed Gushui salt flats for rice.',
  ],
  s0061: [
    'On day gengzi, the great examination of Hanlin and Academicians was held; Wu Baoshu, Qu Hongji, Niu Yugeng, and Sun Yijing were advanced to first rank, the rest promoted or demoted variously.',
    'On gengzi day the Hanlin great exam advanced Wu Baoshu, Qu Hongji, Niu Yugeng, and Sun Yijing to top class.',
  ],
  s0062: [
    'On day jiachen, Zhejiang\'s tribute of green jade hairpins and bracelets was halted, and all weaving offices\' special orders were halted as well.',
    'On jiachen day Zhejiang jade hairpin tribute and special weaving orders were stopped.',
  ],
  s0063: [
    'Liu Yuezhao, supervising suppression, recovered Tongwen and other prefectures in Vietnam.',
    'Under Liu Yuezhao\'s command, Tongwen and other Vietnamese towns were retaken.',
  ],
  s0064: [
    'On day wushen, the late Empress Jishun was given the posthumous title Xiaozhe Jishun Shushen Xianming Xiantian Zhang Sheng Yi Huanghou.',
    'On wushen day Empress Jishun received her full posthumous title.',
  ],
  s0065: [
    'On day xinhai, the Ministry of Works divine storehouse caught fire.',
    'On xinhai day the Ministry of Works treasury burned.',
  ],
  s0066: [
    'On day renzi, the Ministry of Justice clerical offices caught fire.',
    'On renzi day the Ministry of Justice record offices burned.',
  ],
  s0067: [
    'Li Hanzhang was ordered to proceed to Yunnan to investigate the Margary case; Xue Huan was sent after him to join the inquiry.',
    'Li Hanzhang was sent to Yunnan on the Margary case and Xue Huan followed to assist.',
  ],
  s0068: [
    'On day yimao, at the summer solstice, Earth was sacrificed to at the Square Mound.',
    'On yimao, summer solstice, Earth was sacrificed to at Fangze.',
  ],
  s0069: [
    'Sixth month, day wuchen: Jilin General Yirong was stripped of office and banished.',
    'In month 6, wuchen, Jilin General Yirong was dismissed and exiled.',
  ],
  s0070: [
    'On day gengwu, bandits in Fengtian seized Dadonggou and rebelled; Chong Shi suppressed and pacified them.',
    'On gengwu day Fengtian bandits held Dadonggou until Chong Shi crushed them.',
  ],
  s0071: [
    'Gansu tribute by quota was halted.',
    'Gansu\'s quota tribute presentations were stopped.',
  ],
  s0072: [
    'On day jiawu, civilian arrears and banner rents in Zhili before the tenth year of Tongzhi were remitted, and back taxes were forgiven.',
    'On jiawu day Zhili\'s pre-Tongzhi-10 civilian and banner debts and back taxes were forgiven.',
  ],
  s0073: [
    'By imperial edict Prince Chun, with the grand councilors, was to recommend from each yamen men versed in Green Standard and Brave Camp discipline and bodyguards fit to command troops.',
    'An edict told Prince Chun and the council to name disciplined Green Standard and Brave Camp officers and guards fit for command.',
  ],
  s0074: [
    'On day renwu, as the late Muzong\'s coffin was to be moved to the imperial tomb, officials were warned in advance not to prepare an imperial roadway; soon harsh exactions were forbidden.',
    'On renwu day, before Muzong\'s coffin moved to the tomb, officials were warned against imperial-road levies and later against harassment.',
  ],
  s0075: [
    'Autumn, seventh month, day wuxu: Zhili arrears before the sixth year of Tongzhi and grain taxes were remitted.',
    'In autumn month 7, wuxu, Zhili\'s pre-Tongzhi-6 taxes and grain levies were forgiven.',
  ],
  s0076: [
    'On day gengzi, the Yongding River breached its banks.',
    'On gengzi day the Yongding River broke.',
  ],
  s0077: [
    'Each province was ordered to review thoroughly cases appealed to the capital.',
    'Provinces were told to clear Beijing-appealed cases.',
  ],
  s0078: [
    'Granary grain from Taiyuan and other counties was lent to feed the people.',
    'Taiyuan and other counties lent granary grain for famine relief.',
  ],
  s0079: [
    'On day guimao, Liu Dian was rewarded with Third Rank Beijing Office and ordered to assist in Shaanxi-Gansu military affairs.',
    'On guimao day Liu Dian received third-rank Beijing rank to assist on the Shaanxi-Gansu front.',
  ],
  s0080: [
    'Hubei\'s rice and grain likin tax was remitted.',
    'Hubei\'s grain likin was abolished.',
  ],
  s0081: [
    'On day jiachen, treaty exchange with Peru was completed.',
    'On jiachen day Peru\'s treaty exchange was completed.',
  ],
  s0082: [
    'The Zongli Yamen was ordered jointly to plan protection of Chinese laborers abroad.',
    'The Zongli Yamen was told to plan safeguards for overseas Chinese workers.',
  ],
  s0083: [
    'On day bingwu, Empress Dowager Ci\'an\'s birthday; banquets were halted.',
    'On bingwu, Ci\'an\'s birthday, court feasts were canceled.',
  ],
  s0084: [
    'On day renxu, Li Hongzhang and Ding Richang were ordered to negotiate the Margary case with the British envoy Wade.',
    'On renxu day Li Hongzhang and Ding Richang were sent to treat the Margary case with Britain\'s Wade.',
  ],
  s0085: [
    'Expectant Vice Minister Guo Songtao and Expectant Circuit Intendant Xu Ling were appointed envoys to Britain.',
    'Expectant Vice Minister Guo Songtao and Expectant Intendant Xu Ling became envoys to Britain.',
  ],
  s0086: [
    'Eighth month, day wuyin: assessed taxes were remitted for Shaanxi districts disturbed by warfare.',
    'In month 8, wuyin, Shaanxi war districts had taxes forgiven.',
  ],
  s0087: [
    'On day gengchen, items due from the Changlu and Liang-Huai salt commissioners were remitted.',
    'On gengchen day Changlu and Liang-Huai salt commissioners\' tribute items were waived.',
  ],
  s0088: [
    'On day gengyin, Ding Richang was ordered to supervise the Fujian naval dockyard.',
    'On gengyin day Ding Richang took charge of Fujian\'s naval shipyard.',
  ],
  s0089: [
    'Ninth month, day dingyou: Mutu Shan was ordered to rectify Jilin officialdom and banner camps.',
    'In month 9, dingyou, Mutu Shan was told to clean up Jilin officials and banners.',
  ],
  s0090: [
    'On day jiachen, regulations on foreigners traveling in the interior were reaffirmed.',
    'On jiachen day the treaty rules on foreign travel inland were tightened.',
  ],
  s0091: [
    'Wu Tang supervised suppression of bandits who had fled into Xuyong Circuit.',
    'Wu Tang led the campaign against bandits in Xuyong.',
  ],
  s0092: [
    'On day xinhai, five-tenths of assessed taxes were remitted for Daxing and other counties along the coffin route, seven-tenths for Zunhua; silver was granted to compensate flattened wheat fields for seed, and surplus grain levies and banner rents were remitted and forgiven.',
    'On xinhai day coffin-route counties got heavy tax cuts, seed silver for ruined wheat, and surplus levies forgiven.',
  ],
  s0093: [
    'On day jiayin, the coffin was installed at Longfu Temple.',
    'On jiayin day the coffin was lodged at Longfu Temple.',
  ],
  s0094: [
    'On day yimao, the emperor visited the imperial tombs.',
    'On yimao day the emperor toured the imperial tombs.',
  ],
  s0095: [
    'He inspected works at Puxiangyu and Putuoyu.',
    'He inspected tomb works at Puxiangyu and Putuoyu.',
  ],
  s0096: [
    'On day bingchen, he inspected works at Huiling.',
    'On bingchen day he inspected Huiling\'s works.',
  ],
  s0097: [
    'On day dingsi, both empresses dowager were escorted back to the palace.',
    'On dingsi day both empresses dowager returned to the palace.',
  ],
  s0098: [
    'On day gengshen, he returned from Longfu Temple.',
    'On gengshen day he came back from Longfu Temple.',
  ],
  s0099: [
    'On day xinyou, Wang Kaitai was ordered to manage Taiwan\'s aborigines.',
    'On xinyou day Wang Kaitai was told to handle Taiwan\'s aborigines.',
  ],
  s0100: [
    'On day guihai, Liu Changyou defeated the Vietnamese bandits; the bandit chiefs Huang Chongying and Zhou Jianxin were executed.',
    'On guihai day Liu Changyou routed Vietnamese bandits and executed chiefs Huang Chongying and Zhou Jianxin.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b01.mjs <translation.json>'
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
