#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'Fifth month, day dingyou: Agui was summoned to the capital; Han Cheng and Fulehun were ordered to plan river works.',
    'In the fifth month, Agui was recalled to Beijing and Han Cheng and Fulehun took charge of the river project.',
  ],
  s0502: [
    'On day jihai, relief was given for flood disaster in Shandong prefectures including Caozhou, Yanzhou, and Jining, and in Jiangsu counties including Xuzhou, Feng, and Pei.',
    'On jihai day, flood relief reached Shandong and Jiangsu districts including Caozhou and Xuzhou.',
  ],
  s0503: [
    'On day xinchou, quota land tax was remitted for six Henan counties including Xiangfu stricken by flood.',
    'On xinchou day, flood-struck Henan counties including Xiangfu were exempted from quota tax.',
  ],
  s0504: [
    'The newly built city at Balkhash was named Jiade.',
    'The new Balkhash city was named Jiade.',
  ],
  s0505: [
    'On day wushen, the Emperor proceeded to Mulan.',
    'On wushen day, the Emperor went to Mulan.',
  ],
  s0506: [
    'On day gengxu, quota land tax was remitted for eighteen Anhui prefectures and counties including Huaining and five guards including Anqing stricken by flood.',
    'On gengxu day, flood quota tax was remitted in eighteen Anhui districts and five Anqing guards.',
  ],
  s0507: [
    'On day jiayin, the Emperor halted at the Mountain Resort for Summer Retreat.',
    'On jiayin day, the Emperor stayed at the Summer Resort.',
  ],
  s0508: [
    'Sixth month, day bingzi: Guotai and Yu Yijian were sentenced to death by decapitation.',
    'In the sixth month, Guotai and Yu Yijian were sentenced to decapitation.',
  ],
  s0509: [
    'Fu Gong was made Anhui governor.',
    'Fu Gong became governor of Anhui.',
  ],
  s0510: [
    'Autumn, seventh month, new moon on day bingchen: Agui was again ordered to supervise river works.',
    'In the seventh month, Agui was reappointed to supervise the river project.',
  ],
  s0511: [
    'On day wuxu, Sonombu Celeng was sentenced to death by decapitation.',
    'On wuxu day, Sonombu Celeng was sentenced to decapitation.',
  ],
  s0512: [
    'On day guimao, Guotai and Yu Yijian were granted suicide.',
    'On guimao day, Guotai and Yu Yijian were allowed to take their own lives.',
  ],
  s0513: [
    'On day jiachen, because tribute goods arranged by Li Shiyao and Guotai had been excessive, both incurred guilt; governors and others were instructed only to keep themselves pure and not make presenting tribute their special talent.',
    'On jiachen day, Li Shiyao and Guotai were punished for lavish tribute gifts and officials were told to stay honest rather than compete in presents.',
  ],
  s0514: [
    'On day jiwei, He Yucheng was made acting Grand Canal governor-general east of the river.',
    'On jiwei day, He Yucheng acted as eastern Grand Canal governor-general.',
  ],
  s0515: [
    'On day guihai, forty-six years of quota land tax was remitted for four Gansu counties including Longxi stricken by flood.',
    'On guihai day, forty-six years of flood tax was remitted in four Longxi-area counties.',
  ],
  s0516: [
    'Eighth month, day dingmao: Fukang\'an was made an imperial presence minister.',
    'In the eighth month, Fukang\'an became an imperial presence minister.',
  ],
  s0517: [
    'On day guiyou, Imperial clansman Yongwei was made Jilin general; Imperial clansman Hengxiu was made Heilongjiang general.',
    'On guiyou day, Yongwei became Jilin general and Hengxiu Heilongjiang general.',
  ],
  s0518: [
    'On day jiaxu, Yinglian, Ji Huang, Heshen, Li Shiyao, and Fukang\'an were advanced to Senior Guardian of the Heir Apparent; Liang Guozhi and Zheng Dajin to Junior Guardian; Sa Zai to Lesser Guardian.',
    'On jiaxu day, five ministers received Senior Guardian ranks and Liang, Zheng, and Sa received junior guardian titles.',
  ],
  s0519: [
    'On day renwu, relief was given for flood victims in Jiangsu prefectures and counties including Peixian and in Shandong counties Zou and Yi.',
    'On renwu day, flood relief reached Peixian in Jiangsu and Zou and Yi in Shandong.',
  ],
  s0520: [
    'On day guimei, the Emperor proceeded to Mulan for the hunting encampment.',
    'On guimei day, the Emperor went to Mulan for the autumn hunt.',
  ],
  s0521: [
    'On day yiyou, Sonombu Celeng was granted suicide.',
    'On yiyou day, Sonombu Celeng was allowed to kill himself.',
  ],
  s0522: [
    'On day renchen, relief was given for flood victims in Shandong prefectures and counties including Yanzhou.',
    'On renchen day, Shandong flood victims including Yanzhou received relief.',
  ],
  s0523: [
    'Ninth month, day bingchen: Zhejiang Wenlan Pavilion was built.',
    'In the ninth month, the Zhejiang Wenlan Pavilion was built.',
  ],
  s0524: [
    'On day renyin, the Emperor returned and halted at the Mountain Resort for Summer Retreat.',
    'On renyin day, the Emperor returned to the Summer Resort.',
  ],
  s0525: [
    'On day guimao, Minister of Justice Defu died; Kaning\'a replaced him.',
    'On guimao day, Defu, minister of justice, died and Kaning\'a succeeded him.',
  ],
  s0526: [
    'Yinglian was ordered temporarily to oversee the Ministry of Justice.',
    'Yinglian was placed in charge of justice temporarily.',
  ],
  s0527: [
    'On day yisi, Imperial clansman Yongwei was transferred to be Mukden general; Qing Gui was made Jilin general.',
    'On yisi day, Yongwei became Mukden general and Qing Gui Jilin general.',
  ],
  s0528: [
    'On day xinhai, Chen Huizu was stripped of office and arrested for inquiry; Fulehun was transferred to be Fujian-Zhejiang governor-general, with Fu Chang\'an acting.',
    'On xinhai day, Chen Huizu was arrested, Fulehun became Fujian-Zhejiang governor-general, and Fu Chang\'an acted for him.',
  ],
  s0529: [
    'Li Shijie was transferred to be Henan governor; Zha Li was made Hunan governor.',
    'Li Shijie became Henan governor and Zha Li Hunan governor.',
  ],
  s0530: [
    'On day jiwei, relief was given for victims of sea overflow disaster in Zhejiang places including Yuhuan.',
    'On jiwei day, Zhejiang coastal flood victims including Yuhuan received relief.',
  ],
  s0531: [
    'On day xinyou, quota land tax was remitted for five Fengtian departments and counties including Chengde stricken by flood.',
    'On xinyou day, flood quota tax was remitted in five Chengde-area districts.',
  ],
  s0532: [
    'Winter, tenth month, day guiyou: the newly built city Kuerkala Wusu was named Qingsui, and Jinghe city was named Anfu.',
    'In the tenth month, new cities were named Qingsui (Kuerkala Wusu) and Anfu (Jinghe).',
  ],
  s0533: [
    'On day dingmao, relief was given for flood disaster in sixteen Henan counties including Ruyang.',
    'On dingmao day, sixteen Henan counties including Ruyang received flood relief.',
  ],
  s0534: [
    'On day jiashen, Zhili governor-general Zheng Dajin died; Yuan Shoutong acted in his place.',
    'On jiashen day, Zheng Dajin, governor-general of Zhili, died and Yuan Shoutong acted.',
  ],
  s0535: [
    'Fu Song was made Zhejiang governor.',
    'Fu Song became governor of Zhejiang.',
  ],
  s0536: [
    'Relief was given for flood and drought disaster in sixteen Anhui prefectures, counties, and guards including Shouzhou.',
    'Flood and drought relief reached sixteen Anhui districts including Shouzhou.',
  ],
  s0537: [
    'Twelfth month, new moon on day guihai: Chen Huizu and Guo Dong and others were sentenced to death by decapitation.',
    'In the twelfth month, Chen Huizu, Guo Dong, and others were sentenced to decapitation.',
  ],
  s0538: [
    'On day jiashen, Chang Qing was transferred to be Hangzhou general.',
    'On jiashen day, Chang Qing became Hangzhou general.',
  ],
  s0539: [
    'Urtunaxun was made Chahar commander-in-chief.',
    'Urtunaxun became Chahar commander-in-chief.',
  ],
  s0540: [
    'Forty-eighth year, spring, first month, day jiawu: Yixing\'a was made Hunan governor.',
    'In the forty-eighth year, spring, Yixing\'a became Hunan governor.',
  ],
  s0541: [
    'On day wushen, Sa Zai was made Liangjiang governor-general; Bi Yuan Shaanxi governor; Liu Bingtian Yunnan governor.',
    'On wushen day, Sa Zai took Liangjiang, Bi Yuan Shaanxi, and Liu Bingtian Yunnan.',
  ],
  s0542: [
    'Second month, day jiazi: Chen Huizu was granted suicide; Wang Sui was executed by decapitation.',
    'In the second month, Chen Huizu was allowed suicide and Wang Sui was executed.',
  ],
  s0543: [
    'On day yichou, Yu Qi was made grain transport governor-general.',
    'On yichou day, Yu Qi became grain transport governor-general.',
  ],
  s0544: [
    'On day bingyin, Lawang Duo\'erji was made imperial presence minister.',
    'On bingyin day, Lawang Duo\'erji became an imperial presence minister.',
  ],
  s0545: [
    'On day wuchen, an order was issued to build the Piyong Hall at the Imperial Academy.',
    'On wuchen day, the court ordered a Piyong built at the Imperial Academy.',
  ],
  s0546: [
    'On day xinwei, the Emperor proceeded to the Western Tombs and remitted three-tenths of quota tax in places passed through.',
    'On xinwei day, the Emperor visited the Western Tombs and cut passing districts\' tax by thirty percent.',
  ],
  s0547: [
    'On day yihai, the Emperor proceeded to Tailing and Taidongling.',
    'On yihai day, the Emperor visited Tailing and Taidongling.',
  ],
  s0548: [
    'On day wuzi, Xiong Tingbi\'s fifth-generation descendant Si Xian was granted the post of educational instructor in Confucian learning as Ming Liaodong military commissioner.',
    'On wuzi day, Ming general Xiong Tingbi\'s descendant Si Xian received a Confucian instructor post.',
  ],
  s0549: [
    'Third month, day xinchou: Grand Secretary Agui and others were granted deliberation on merit promotion.',
    'In the third month, Agui and other grand secretaries received merit review.',
  ],
  s0550: [
    'Vice Ministers of Rites Qian Zai and others retired at their original rank.',
    'Vice Ministers Qian Zai and others retired at grade.',
  ],
  s0551: [
    'Governor-general Yuan Shoutong and others, governors Nong Qi and others were granted deliberation on merit promotion.',
    'Yuan Shoutong, Nong Qi, and other governors received merit review.',
  ],
  s0552: [
    'Zhu Chun was summoned to the capital; Liu E was made Guangxi governor.',
    'Zhu Chun was recalled to Beijing and Liu E became Guangxi governor.',
  ],
  s0553: [
    'On day jiayin, quota land tax was remitted for nineteen Jiangsu prefectures and counties including Tongshan and three guards including Huai\'an stricken by flood and drought.',
    'On jiayin day, flood and drought tax was remitted in nineteen Jiangsu districts and three Huai\'an guards.',
  ],
  s0554: [
    'Summer, fourth month, day yichou: Imperial presence minister, Khalkha Prince Zhala Feng\'a died; Lawang Duo\'erji was made imperial presence minister.',
    'In the fourth month, Prince Zhala Feng\'a died and Lawang Duo\'erji replaced him as imperial presence minister.',
  ],
  s0555: [
    'On day yihai, the Emperor reviewed the Firearms Brigade troops.',
    'On yihai day, the Emperor reviewed firearms troops.',
  ],
  s0556: [
    'On day xinsi, Fukang\'an was summoned to the capital.',
    'On xinsi day, Fukang\'an was summoned to Beijing.',
  ],
  s0557: [
    'Fifth month, day renchen: Fukang\'an was made chief commandant eunuch-minister of the Court Guard of the Plain Yellow Banner.',
    'In the fifth month, Fukang\'an became chief guard minister of the Plain Yellow Banner.',
  ],
  s0558: [
    'Li Fenghan was granted the concurrent titles of Minister of War and Censor-in-chief of the Right.',
    'Li Fenghan received minister of war and right censor-in-chief titles.',
  ],
  s0559: [
    'On day jiachen, Zhu Chun was made Left Censor-in-chief.',
    'On jiachen day, Zhu Chun became left censor-in-chief.',
  ],
  s0560: [
    'On day bingwu, Associate Grand Secretary and Minister of Personnel Yonggui died.',
    'On bingwu day, Associate Grand Secretary Yonggui died.',
  ],
  s0561: [
    'Quota land tax was remitted for eleven Anhui prefectures and counties including Shouzhou stricken by flood the previous year.',
    'Prior-year flood tax was remitted in eleven Anhui districts including Shouzhou.',
  ],
  s0562: [
    'On day dingwei, Zhili governor-general Yuan Shoutong died; Liu E replaced him.',
    'On dingwei day, Yuan Shoutong died and Liu E succeeded as Zhili governor-general.',
  ],
  s0563: [
    'Sun Shiyi was made Guangxi governor; Wu Mitai Minister of Personnel and associate grand secretary.',
    'Sun Shiyi became Guangxi governor and Wu Mitai personnel minister and associate grand secretary.',
  ],
  s0564: [
    'On day jiyou, the Emperor fell ill and ordered Yong Yu to substitute in sacrificing at the Altar of Earth.',
    'On jiyou day, illness kept the Emperor from the Earth Altar and Yong Yu officiated.',
  ],
  s0565: [
    'On day guichou, the Emperor proceeded to Mulan.',
    'On guichou day, the Emperor went to Mulan.',
  ],
  s0566: [
    'On day gengshen, the Emperor halted at the Mountain Resort for Summer Retreat.',
    'On gengshen day, the Emperor stayed at the Summer Resort.',
  ],
  s0567: [
    'Sixth month, day yichou: Tiren Pavilion caught fire.',
    'In the sixth month, Tiren Pavilion burned.',
  ],
  s0568: [
    'On day yiyou, quota tax was remitted for five Shandong salt-fields including Yongfu stricken by flood the previous year.',
    'On yiyou day, prior-year flood tax was remitted at five Shandong salt-fields including Yongfu.',
  ],
  s0569: [
    'On day dinghai, relief was given for flood disaster in six Hubei prefectures and counties including Guangji.',
    'On dinghai day, six Hubei districts including Guangji received flood relief.',
  ],
  s0570: [
    'Autumn, seventh month, day wuxu: Hailu was ordered to act as Ili general; Tusi\'i to act as Urumqi commander-in-chief.',
    'In the seventh month, Hailu acted at Ili and Tusi\'i at Urumqi.',
  ],
  s0571: [
    'On day yimao, Cai Xin was made Grand Secretary of the Wenhua Hall; Liang Guozhi associate grand secretary; Liu Yong Minister of Personnel.',
    'On yimao day, Cai Xin entered the Wenhua Hall, Liang Guozhi became associate grand secretary, and Liu Yong personnel minister.',
  ],
  s0572: [
    'Eighth month, day jiawu: the Dalai Lama was granted a jade register and jade seal.',
    'In the eighth month, the Dalai Lama received jade patent and seal.',
  ],
  s0573: [
    'On day jiaxu, Mingliang, Balintai, and others were stripped of office and arrested for inquiry; Hailu was made Urumqi commander-in-chief.',
    'On jiaxu day, Mingliang and Balintai were arrested and Hailu became Urumqi commander.',
  ],
  s0574: [
    'On day yihai, the Emperor from the Summer Resort proceeded to Mukden to visit the tombs and remitted five-tenths of this year\'s quota tax in places passed through.',
    'On yihai day, the Emperor left the Summer Resort for Mukden tomb rites and halved passing districts\' annual tax.',
  ],
  s0575: [
    'On day gengchen, Senior Guardian of the Heir Apparent and Grand Secretary Yinglian died.',
    'On gengchen day, Grand Secretary Yinglian died.',
  ],
  s0576: [
    'On day xinsi, the Emperor halted at the Hanada great encampment.',
    'On xinsi day, the Emperor camped at Hanada.',
  ],
  s0577: [
    'Khalkha Prince Late Nasidi and others met the imperial progress; rewards were given in varying measure.',
    'Prince Late Nasidi and others met the Emperor and received graded rewards.',
  ],
  s0578: [
    'On day dinghai, the Emperor halted at the Wulitun great encampment; Khorchin Prince Gong Gelabutan, Balin Prince Batu, and others met the progress; rewards in varying measure.',
    'On dinghai day, at Wulitun camp Khorchin and Balin princes met the Emperor and were rewarded.',
  ],
  s0579: [
    'On day wuzi, Yuan Chonghuan\'s fifth-generation descendant Bing was granted selection and appointment to an eighth- or ninth-rank post as Ming Liaodong military commissioner.',
    'On wuzi day, Ming commander Yuan Chonghuan\'s descendant Bing received an eighth- or ninth-rank post.',
  ],
  s0580: [
    'Ninth month, new moon on day jichou: the Emperor halted at the Sibuzi East great encampment and reviewed archery.',
    'At the new moon of the ninth month, the Emperor reviewed archery at Sibuzi East camp.',
  ],
  s0581: [
    'The eleventh prince Yong Xuan and others were ordered to welcome the patent and seal to Mukden and store them in the Imperial Ancestral Temple.',
    'Prince Yong Xuan and others were sent to bring patent and seal to Mukden for the ancestral temple.',
  ],
  s0582: [
    'On day guisi, the Emperor halted at the Laobian great encampment and reviewed archery.',
    'On guisi day, the Emperor reviewed archery at Laobian camp.',
  ],
  s0583: [
    'The King of Korea sent envoys presenting local products as tribute.',
    'Korea sent tribute envoys.',
  ],
  s0584: [
    'On day yiwei, quota land tax for the forty-ninth year of Qianlong was remitted for all Fengtian dependencies.',
    'On yiwei day, Fengtian\'s forty-ninth-year quota tax was remitted.',
  ],
  s0585: [
    'On day wuxu, the Emperor visited Yongling.',
    'On wuxu day, the Emperor visited Yongling.',
  ],
  s0586: [
    'On day jihai, the great offering sacrifice was performed.',
    'On jihai day, the great offering rite was held.',
  ],
  s0587: [
    'Xingjing city was inspected.',
    'The Emperor inspected Mukden (Xingjing).',
  ],
  s0588: [
    'Grain from the granaries of all estate heads under the Mukden Revenue Board was remitted.',
    'Mukden estate granary grain was remitted.',
  ],
  s0589: [
    'Five-tenths of the rice, beans, and fodder due on banner land in Mukden and elsewhere was remitted.',
    'Half the grain and fodder due on Mukden banner land was forgiven.',
  ],
  s0590: [
    'Capital crimes in Fengtian and elsewhere were reduced; punishments below exile were pardoned.',
    'Capital sentences in Fengtian were reduced and lesser crimes pardoned.',
  ],
  s0591: [
    'On day guimao, the Emperor visited Fuling.',
    'On guimao day, the Emperor visited Fuling.',
  ],
  s0592: [
    'On day jiachen, the great offering sacrifice was performed.',
    'On jiachen day, the great offering rite was held.',
  ],
  s0593: [
    'The Emperor visited Zhaoling and personally offered at the tomb of Merit King Yangguli.',
    'The Emperor visited Zhaoling and mourned at Merit King Yangguli\'s tomb.',
  ],
  s0594: [
    'On day yisi, the great offering sacrifice was performed.',
    'On yisi day, the great offering rite was held.',
  ],
  s0595: [
    'On day bingwu, the Emperor personally offered at the tomb of Prince Keqin Yuetuo.',
    'On bingwu day, the Emperor mourned at Prince Keqin Yuetuo\'s tomb.',
  ],
  s0596: [
    'On day dingwei, the Emperor personally offered at the tombs of Duke Hongyi Ebilun and Duke Zhiyi Feiyingdong.',
    'On dingwei day, the Emperor mourned at Dukes Ebilun and Feiyingdong\'s tombs.',
  ],
  s0597: [
    'On day wushen, the Emperor took the throne in the Chongzheng Hall to receive congratulatory rites.',
    'On wushen day, the Emperor received congratulations in Chongzheng Hall.',
  ],
  s0598: [
    'At the Dazheng Hall he bestowed a banquet on princes, nobles, and ministers in attendance and gave rewards in varying measure.',
    'At Dazheng Hall the Emperor feasted the entourage and gave graded rewards.',
  ],
  s0599: [
    'On day jiyou, the Emperor proceeded to the Qingning Palace to sacrifice to the spirits and bestowed sacrificial meat on princes, nobles, and ministers.',
    'On jiyou day, at Qingning Palace the Emperor sacrificed and shared sacrificial meat with the court.',
  ],
  s0600: [
    'On day gengxu, the Emperor returned from progress.',
    'On gengxu day, the Emperor began the return journey.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_014_b06.mjs <translation.json>'
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
