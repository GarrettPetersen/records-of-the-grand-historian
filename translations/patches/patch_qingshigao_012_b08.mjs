#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'On day yimao, dredging and construction of Zhili river dikes were ordered, using labor for relief.',
    'On yimao day, Zhili river dikes were to be dredged and built with work-for-relief labor.',
  ],
  s0702: [
    'On day bingchen, the Shanxi Guiyuan circuit intendant was moved to be stationed at Suiyuan city.',
    'On bingchen day, Shanxi\'s Guiyuan intendant was posted at Suiyuan.',
  ],
  s0703: [
    'On day jiwei, the Emperor sacrificed at the tomb of Ming Taizu.',
    'On jiwei day, the Emperor sacrificed at Ming Taizu\'s tomb.',
  ],
  s0704: [
    'Troops were reviewed.',
    'The Emperor reviewed troops.',
  ],
  s0705: [
    'The Emperor visited the residence of Liangjiang governor-general Yin Jishan.',
    'The court visited Yin Jishan\'s Liangjiang governor-general residence.',
  ],
  s0706: [
    'On day gengshen, this year\'s quota land tax was remitted for suburban districts of Jiangsu Jiangning and Suzhou and Hangzhou.',
    'On gengshen day, suburban taxes were waived for Jiangning, Suzhou, and Hangzhou.',
  ],
  s0707: [
    'On day xinyou, five Jiangnan examination candidates including Cheng Jinfang were granted licentiate rank, and three jinshi including Wu Tailai were together appointed Secretariat drafters.',
    'On xinyou day, Cheng Jinfang and four others became licentiates; Wu Tailai and two other jinshi received Secretariat posts.',
  ],
  s0708: [
    'On day renxu, the Emperor conducted the Empress Dowager across the Yangzi.',
    'On renxu day, the Emperor escorted the Empress Dowager across the Yangzi.',
  ],
  s0709: [
    'Summer, fourth month, day gengwu: the Emperor inspected Gaojia Embankment and ordered brick works built continuously from the transport dam to the canal mouth.',
    'In the fourth month, the Emperor inspected Gaojia Embankment and ordered brick dikes from the transport dam to the canal mouth.',
  ],
  s0710: [
    'The Emperor conducted the Empress Dowager across the Yellow River.',
    'The court escorted the Empress Dowager across the Yellow River.',
  ],
  s0711: [
    'Because Grand Court of Revision vice minister Gu Ruxiu, on mission to Annam, had on his own authority sent a letter rebuking the king, he was stripped of office.',
    'Gu Ruxiu was dismissed for rebuking the Annamese king without authority on his mission.',
  ],
  s0712: [
    'On day guiyou, Prince Zhuang Yunlu and others were ordered to escort the Empress Dowager back by water.',
    'On guiyou day, Yunlu and others were to return the Empress Dowager by water route.',
  ],
  s0713: [
    'The Emperor went ashore and inspected the river from Xuzhou.',
    'The Emperor landed and inspected the canal from Xuzhou.',
  ],
  s0714: [
    'On day jiaxu, quota land tax for last year\'s flood was remitted for ten Zhejiang counties including Renhe, one office in Huzhou, and five salterns including Renhe.',
    'On jiaxu day, last year\'s flood taxes were waived in Zhejiang districts including Renhe.',
  ],
  s0715: [
    'On day gengchen, the Emperor sacrificed at the temple of Mencius and visited the temple of the Sage.',
    'On gengchen day, the Emperor worshipped at Mencius\'s temple and the Sage\'s temple.',
  ],
  s0716: [
    'On day xinsi, the Emperor visited the Kong Forest.',
    'On xinsi day, the Emperor visited Confucius\'s grove.',
  ],
  s0717: [
    'Hail-disaster relief was distributed for ten Gansu prefectures and counties including Anding for last year.',
    'Last year\'s hail relief reached ten Gansu districts including Anding.',
  ],
  s0718: [
    'On day renwu, quota land tax for last year\'s flood was remitted for forty-four Shandong prefectures, counties, guards, and posts including Qihe.',
    'On renwu day, Shandong flood taxes were remitted in forty-four districts including Qihe.',
  ],
  s0719: [
    'On day wuzi, the Empress Dowager went ashore and halted at the Dezhou traveling palace.',
    'On wuzi day, the Empress Dowager landed and stayed at the Dezhou traveling palace.',
  ],
  s0720: [
    'On day jichou, the Emperor saw the Empress Dowager aboard her boat.',
    'On jichou day, the Emperor escorted the Empress Dowager onto her boat.',
  ],
  s0721: [
    'On day gengyin, Liu Tongxun was ordered jointly to survey dredging and construction at Jingzhou.',
    'On gengyin day, Liu Tongxun was assigned to survey Jingzhou dredging works.',
  ],
  s0722: [
    'On day xinmao, arrears in quota land tax were remitted for ten Zhili prefectures, counties, and departments including Daxing.',
    'On xinmao day, tax arrears were forgiven in ten Zhili districts including Daxing.',
  ],
  s0723: [
    'Fifth month, day jiawu: because the Qianqing Gate attendant Erchidason of the Elute had exerted himself bravely, he was rewarded with a third-rank baron.',
    'In the fifth month, Elute attendant Erchidason received a third-rank baronage for brave service.',
  ],
  s0724: [
    'Flood relief was distributed for ten Anhui prefectures, counties, guards, and posts including Shouzhou for last year.',
    'Last year\'s flood relief reached ten Anhui districts including Shouzhou.',
  ],
  s0725: [
    'On day yiwei, the Emperor reached Zhuozhou.',
    'On yiwei day, the court arrived at Zhuozhou.',
  ],
  s0726: [
    'Kazakh attendant ministers including Atahai were received in audience and granted graded caps and robes.',
    'Kazakh envoys including Atahai were received and given graded dress.',
  ],
  s0727: [
    'Flood relief was distributed for saltern households in seven Changlu prefectures and counties including Cangzhou and seven salterns including Yanzhen for last year, and taxes were remitted with distinctions.',
    'Changlu saltern households in Cangzhou and other districts received graded flood relief and tax remissions.',
  ],
  s0728: [
    'On day xinchou, the Emperor went to Huangxinzhuang to welcome the Empress Dowager to reside at Shenchang Spring Garden.',
    'On xinchou day, the Emperor welcomed the Empress Dowager to Shenchang Spring Garden.',
  ],
  s0729: [
    'Flood relief was distributed for four Hunan prefectures and counties including Wuling for last year, and quota land tax was remitted with distinctions.',
    'Hunan flood relief and graded tax remissions reached four districts including Wuling.',
  ],
  s0730: [
    'On day guimao, quota land tax on flooded lowlands was abolished for four Anhui prefectures, counties, guards, and posts including Hong county.',
    'On guimao day, taxes on flooded lowlands were lifted in four Anhui districts including Hong.',
  ],
  s0731: [
    'On day wushen, Ebi was transferred to be Shaanxi governor.',
    'On wushen day, Ebi became Shaanxi governor.',
  ],
  s0732: [
    'Zhalafeng\'a was made chief commandant-attendant of the Plain White Banner.',
    'Zhalafeng\'a became Plain White Banner chief commandant-attendant.',
  ],
  s0733: [
    'On day guichou, Wohe was made superintendent of the Imperial Household Department.',
    'On guichou day, Wohe became Imperial Household superintendent.',
  ],
  s0734: [
    'Intercalary fifth month, new moon on day guihai: because Qingbao was aged, he was summoned to the capital.',
    'On the intercalary fifth-month new moon, the aged Qingbao was recalled to Beijing.',
  ],
  s0735: [
    'Geshetu was transferred to be Mukden general, with Chaoyin acting.',
    'Geshetu became Mukden general and Chaoyin served in his stead.',
  ],
  s0736: [
    'On day dingmao, quota land tax for last year\'s flood was remitted for nine Hubei prefectures, counties, guards, and posts including Qianjiang.',
    'On dingmao day, Hubei flood taxes were waived in nine districts including Qianjiang.',
  ],
  s0737: [
    'On day xinsi, Nayantai\'s property was confiscated.',
    'On xinsi day, Nayantai\'s estate was seized.',
  ],
  s0738: [
    'On day xinmao, Xi\'an general Rusong was ordered to inherit as Prince of Feng; De Zhao\'s son Xiuling was to inherit Rusong\'s dukedom.',
    'On xinmao day, Rusong inherited as Prince of Feng and Xiuling succeeded his dukedom.',
  ],
  s0739: [
    'Chahar commander Songchun was changed to Xi\'an general, with Ba\'erpin replacing him.',
    'Songchun became Xi\'an general and Ba\'erpin took his Chahar command.',
  ],
  s0740: [
    'Sixth month, day dingyou: quota land tax for last year\'s flood was remitted for seventy-four Zhili prefectures, counties, and departments including Gu\'an.',
    'In the sixth month, last year\'s flood taxes were remitted in seventy-four Zhili districts including Gu\'an.',
  ],
  s0741: [
    'On day renyin, compiler Shen Qili, retired after receiving the southern tour, was summoned to the capital, and thirteen officials demoted for offenses including Feng Hao were granted audience.',
    'On renyin day, Shen Qili was recalled and Feng Hao and twelve others were presented after demotion.',
  ],
  s0742: [
    'On day yisi, because Korla begs and others presented tribute, an edict ordered rewards at assessed value and a general notice to all cities that non-ceremonial local products should cease.',
    'On yisi day, Korla tribute was rewarded at value and other cities were told to stop non-ceremonial gifts.',
  ],
  s0743: [
    'On day jiyou, because former general Bandi and Grand Minister Resident Erong\'an had died loyally at their posts in Yili, seats of sacrifice were ordered set up behind the Yili Guandi Temple.',
    'On jiyou day, memorial seats were established at Yili for Bandi and Erong\'an.',
  ],
  s0744: [
    'Autumn, seventh month, day renxu: because troublemakers from Korea\'s Sanshui prefecture had fled across the border, Henglu and others were ordered to the frontier to investigate.',
    'In the seventh month, Henglu was sent to the border after Korean fugitives crossed over.',
  ],
  s0745: [
    'On day guihai, quota land tax for last year\'s flood was remitted for sixteen Anhui prefectures, counties, guards, and posts including Shouzhou.',
    'On guihai day, Anhui flood taxes were waived in sixteen districts including Shouzhou.',
  ],
  s0746: [
    'On day wuchen, the Emperor conducted the Empress Dowager on a tour to Mulan and remitted five-tenths of this year\'s grain taxes for places through which the court passed.',
    'On wuchen day, the court toured Mulan and transit districts received a fifty-percent tax cut.',
  ],
  s0747: [
    'On day yihai, Kokand had seized Ous and other places of the Edegena Ajibi Kirghiz; Yonggui was ordered to memorialize Kokand to return them.',
    'On yihai day, Yonggui was told to demand Kokand restore Kirghiz lands at Ous.',
  ],
  s0748: [
    'Eighth month, day gengzi: two cities in Yili, Gulezha and Uhalirik, were built and named Suide and Anyuan.',
    'In the eighth month, Yili cities Gulezha and Uhalirik were founded as Suide and Anyuan.',
  ],
  s0749: [
    'The Emperor conducted the Empress Dowager back to lodge at the Mountain Resort for Avoiding Summer Heat.',
    'The court returned the Empress Dowager to the summer resort.',
  ],
  s0750: [
    'On day jiachen, because Tuo\'enduo was in mourning, Mingshan was transferred to act as Guangdong governor, Suchang additionally acting; Tang Pin was made Jiangxi governor; Song Bangsui was made Hubei governor, with Aibida additionally acting.',
    'On jiachen day, mourning for Tuo\'enduo brought a round of acting and new governors in the south.',
  ],
  s0751: [
    'On day renzi, arrears in quota land tax were remitted for seventeen Zhili prefectures, counties, and departments including Wen\'an, and this year\'s flood taxes for five counties including Ninghe.',
    'On renzi day, Zhili arrears and Ninghe flood taxes were remitted.',
  ],
  s0752: [
    'On day bingchen, the Chahar commander was granted an imperial patent.',
    'On bingchen day, the Chahar commander received an imperial commission.',
  ],
  s0753: [
    'Heilongjiang general Chuoleduo died; Guoduohuan was transferred to replace him.',
    'Chuoleduo died and Guoduohuan became Heilongjiang general.',
  ],
  s0754: [
    'Ninth month, day guihai: Basang, an Elute of Tacheng who had come over from the Kazakhs, was rewarded with silks.',
    'In the ninth month, Kazakh defector Basang of Tacheng received silks.',
  ],
  s0755: [
    'On day gengwu, the Emperor conducted the Empress Dowager back to the capital.',
    'On gengwu day, the court returned the Empress Dowager to Beijing.',
  ],
  s0756: [
    'On day xinwei, Badakhshan\'s sultan sent envoys to audience.',
    'On xinwei day, Badakhshan\'s sultan presented envoys.',
  ],
  s0757: [
    'On day dingchou, Qianqing Gate guard Mingren was ordered to take an imperial physician posthaste to treat Hu Baohan\'s illness.',
    'On dingchou day, Mingren was sent with a court physician to Hu Baohan.',
  ],
  s0758: [
    'Flood relief was distributed for thirty-five Shandong prefectures, counties, guards, and posts including Qihe, and quota land tax was remitted.',
    'Shandong flood relief and tax remissions reached thirty-five districts including Qihe.',
  ],
  s0759: [
    'On day jiashen, Urumqi fortresses were built; the cities were named Ningbian and Jihuai, and the forts Xuanren, Huaiyi, Lequan, Baochang, Huilai, and Lüfeng.',
    'On jiashen day, Urumqi gained cities Ningbian and Jihuai and six named forts.',
  ],
  s0760: [
    'On day wuzi, Board of Colonial Affairs minister and chief commandant-attendant Fude was stripped of office and arrested for questioning for demanding horses and livestock from Mongol princes.',
    'On wuzi day, Fude was dismissed and arrested for extorting Mongol princes.',
  ],
  s0761: [
    'On day jichou, Xinzhu was made Board of Colonial Affairs minister and Mingrui chief commandant-attendant of the Plain White Banner.',
    'On jichou day, Xinzhu headed the Board of Colonial Affairs and Mingrui the Plain White Banner guard.',
  ],
  s0762: [
    'Winter, tenth month, day xinmao: Chen Hongmou was transferred to Hunan governor, with Song Bangsui acting; Zhuang Yougong was made Jiangsu governor; Xiong Xuepeng Zhejiang governor; Feng Qian Guangxi governor, with Gu Jimei protecting.',
    'In the tenth month, several southern governorships were reassigned and filled with acting officers.',
  ],
  s0763: [
    'On day guisi, the Burmese chief Gongliyan, for burning and killing the entire family of Menglian native official Dao Paichun, was ordered executed and his head displayed.',
    'On guisi day, Gongliyan was executed and his head shown for murdering Dao Paichun\'s household.',
  ],
  s0764: [
    'On day guimao, because the Afghan ruler Ahmad Shah had sent envoys with tribute, governors along the route were ordered to prepare banquets, and Eledeng\'e was ordered to escort them.',
    'On guimao day, Afghan tribute envoys were to be feasted en route under Eledeng\'e\'s escort.',
  ],
  s0765: [
    'On day yisi, a general-in-chief post was established for Yili and dependencies, with Mingrui appointed.',
    'On yisi day, Mingrui became general-in-chief of Yili.',
  ],
  s0766: [
    'Construction of Kobdo city was ordered.',
    'Kobdo city was ordered built.',
  ],
  s0767: [
    'On day jiyou, flood, hail, and frost relief was distributed for sixty-three Zhili prefectures, counties, and departments including Bazhou, and this year\'s flood taxes were remitted for seventeen Jiangsu prefectures, counties, guards, and posts including Qinghe.',
    'On jiyou day, Zhili disaster relief and Jiangsu flood tax remissions were granted.',
  ],
  s0768: [
    'On day jiayin, flood relief was distributed for twenty-eight Zhejiang prefectures, counties, guards, salterns, and fields including Renhe.',
    'On jiayin day, Zhejiang flood relief reached twenty-eight districts including Renhe.',
  ],
  s0769: [
    'On day dingsi, Fengtian prefect Tong Fushou was removed and tried for indulging magistrate Gao Jin in extorting merchants.',
    'On dingsi day, Tong Fushou was dismissed for shielding Gao Jin\'s merchant extortion.',
  ],
  s0770: [
    'Eleventh month, new moon on day jiwei: the Dezhou section of the Shandong Grand Canal was dredged.',
    'On the eleventh-month new moon, Shandong\'s Dezhou canal was dredged.',
  ],
  s0771: [
    'On day gengshen, Yili Grand Minister Residents were established, with Ailong\'a and Yiletu appointed.',
    'On gengshen day, Ailong\'a and Yiletu became Yili Grand Minister Residents.',
  ],
  s0772: [
    'On day xinyou, Yili brigade commanders were established.',
    'On xinyou day, Yili brigade commanders were created.',
  ],
  s0773: [
    'Mingrui and others were ordered to lead troops to drive off Kazakhs pasturing beyond bounds at Halabaha and other places north of the Tacheng mountains.',
    'Mingrui was to expel trespassing Kazakhs north of Tacheng.',
  ],
  s0774: [
    'On day wuchen, because Saru Kirghiz chief Shabatu had returned horses seized from Kokand traders, Yonggui and others were ordered to reward him as appropriate.',
    'On wuchen day, Shabatu was to be rewarded for returning Kokand traders\' horses.',
  ],
  s0775: [
    'Kirghiz of Khoshchi, invaded by Kokand, came over; they were ordered moved to pasture at Alaketughule and other places.',
    'Khoshchi Kirghiz refugees were resettled at Alaketughule after Kokand\'s attack.',
  ],
  s0776: [
    'On day gengwu, Boshosle was made league chief of the Dorbet; two deputy generals were established, with Cheleng Ubashi right deputy and Basang left deputy.',
    'On gengwu day, Boshosle headed the Dorbet league and Cheleng Ubashi and Basang became deputies.',
  ],
  s0777: [
    'On day xinwei, a new city was built at Kashgar.',
    'On xinwei day, Kashgar\'s new city was founded.',
  ],
  s0778: [
    'On day renshen, Shanxi Pinglu garrison vice commander was changed to commandant; the former middle garrison commandant and Jingping garrison commandant were abolished.',
    'On renshen day, Pinglu\'s vice commander became commandant and two Shanxi posts were cut.',
  ],
  s0779: [
    'On day bingzi, Kazakh Nurbai and Khayaq of Urgenchi city and others sent envoys to audience.',
    'On bingzi day, Kazakh envoys including Nurbai were received.',
  ],
  s0780: [
    'On day jiashen, Fang Guancheng was instructed to follow Henan in dredging roads, ditches, and canals.',
    'On jiashen day, Fang Guancheng was told to dredge roads and drains like Henan.',
  ],
  s0781: [
    'Hail, frost, and snow relief was distributed for twenty Gansu departments, prefectures, and counties including Gaolan for this year.',
    'This year\'s hail and snow relief reached twenty Gansu districts including Gaolan.',
  ],
  s0782: [
    'On day wuzi, rivers, canals, and ditches in Shandong prefectures and counties including Shouzhang were dredged.',
    'On wuzi day, waterways were dredged in Shandong districts including Shouzhang.',
  ],
  s0783: [
    'Twelfth month, day gengyin: Grand Secretary Shi Yizhi, citing age and illness, begged retirement; a gracious edict comforted and retained him and ordered that he need not additionally hold the Works Ministry, as a mark of consideration.',
    'In the twelfth month, Shi Yizhi\'s retirement plea was gently refused and his Works portfolio waived.',
  ],
  s0784: [
    'On day bingshen, the Kashmir beg Niyas asked to come to audience; this was approved.',
    'On bingshen day, Kashmir beg Niyas was permitted an audience.',
  ],
  s0785: [
    'Kokand presented a letter claiming Kirghiz land at Ous as its own; Yonggui and others were ordered to send a stern memorial demanding its return.',
    'Kokand was sternly told to return Kirghiz lands at Ous.',
  ],
  s0786: [
    'On day xinchou, because the Kokand beg had replied to Yonggui that earlier envoys had been titled khan by imperial order and he wished to take Kashgar as his border, an edict ordered a stern memorial of rebuke.',
    'On xinchou day, Kokand\'s claim to khan status and Kashgar was sharply rebuked.',
  ],
  s0787: [
    'On day dingwei, Works Minister Gui Xuangguang died; Dong Bangda replaced him.',
    'On dingwei day, Gui Xuangguang died and Dong Bangda became Works minister.',
  ],
  s0788: [
    'On day renzi, Nashitong was ordered to affairs at Kashgar, replacing Yonggui\'s return to the capital.',
    'On renzi day, Nashitong went to Kashgar and Yonggui returned to Beijing.',
  ],
  s0789: [
    'On day guichou, Badakhshan besieged Boluor; Xinzhu and others were ordered to send stern memorials demanding a ceasefire and the surrender of Burhan al-Din\'s wife and children.',
    'On guichou day, Badakhshan was ordered to lift the siege of Boluor and hand over Burhan al-Din\'s family.',
  ],
  s0790: [
    'Twenty-eighth year, spring, first month, day gengshen: flood relief was distributed with distinctions for thirty-five Zhili prefectures and counties including Bazhou and thirty Shandong prefectures, counties, guards, and posts including Qihe.',
    'In spring of the twenty-eighth year, graded flood relief reached Zhili and Shandong districts including Bazhou and Qihe.',
  ],
  s0791: [
    'On day jiazi, the Emperor held court at the Hall of Purple Glazed Light and granted a banquet to envoys from Afghanistan, Badakhshan, Kokand, and the Kazakh tribes.',
    'On jiazi day, the Emperor feasted Afghan, Badakhshan, Kokand, and Kazakh envoys at Ziguang Pavilion.',
  ],
  s0792: [
    'On day dingmao, the Emperor held a great review at the western parade ground of Shenchang Spring Garden and ordered envoys of all tribes to observe.',
    'On dingmao day, the Emperor reviewed troops at Shenchang Spring Garden before foreign envoys.',
  ],
  s0793: [
    'Faqi was made commander at Guihuacheng.',
    'Faqi became Guihuacheng commander.',
  ],
  s0794: [
    'On day renshen, Agui was ordered to serve at the Grand Council.',
    'On renshen day, Agui joined the Grand Council.',
  ],
  s0795: [
    'On day renwu, Henan governor Hu Baohan died; Ye Cunren was made Henan governor.',
    'On renwu day, Hu Baohan died and Ye Cunren became Henan governor.',
  ],
  s0796: [
    'On day jiashen, Nashitong was made Grand Minister Resident, stationed at Kashgar to oversee Muslim frontier affairs.',
    'On jiashen day, Nashitong became resident minister at Kashgar over the Muslim frontier.',
  ],
  s0797: [
    'On day renchen, Fang Guancheng was ordered to Henan jointly to survey Zhang River works.',
    'On renchen day, Fang Guancheng was sent to survey the Zhang River in Henan.',
  ],
  s0798: [
    'On day wuxu, Xi\'an Manchu and Chinese Banner lieutenant-generals were changed to left and right wing lieutenant-generals.',
    'On wuxu day, Xi\'an Banner lieutenant-generals were reorganized into left and right wings.',
  ],
  s0799: [
    'On day renyin, the Xining resident minister post was abolished.',
    'On renyin day, the Xining resident minister was cut.',
  ],
  s0800: [
    'On day gengxu, the Emperor visited Zhaoxi Mausoleum, Xiaoling, Xiaodongling, and Jingling.',
    'On gengxu day, the Emperor worshipped at Zhaoxi, Xiaoling, Xiaodongling, and Jingling.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_012_b08.mjs <translation.json>'
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
