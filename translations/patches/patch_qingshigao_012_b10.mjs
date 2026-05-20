#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0901: [
    'On day yisi, Chang Jun was transferred to be Yunnan governor.',
    'On yisi day, Chang Jun became Yunnan governor.',
  ],
  s0902: [
    'Wang Jian was made Hubei governor.',
    'Wang Jian became Hubei governor.',
  ],
  s0903: [
    'On day dingwei, Aletai was ordered to return as Sichuan governor-general.',
    'On dingwei day, Aletai was sent back to Sichuan as governor-general.',
  ],
  s0904: [
    'Autumn, seventh month, first day xinhai: Yang Yingqiong was made Grand Secretary while retaining Shaanxi-Gansu governor-general; Chen Hongmou was made Associate Grand Secretary.',
    'In the seventh month on xinhai new moon, Yang Yingqiong joined the Grand Secretariat but stayed at Shaanxi-Gansu; Chen Hongmou became associate grand secretary.',
  ],
  s0905: [
    'On day renzi, Chang Jun was ordered temporarily to act as Huguang governor-general; Liu Zao to act as Yunnan governor.',
    'On renzi day, Chang Jun doubled as Huguang governor-general and Liu Zao as Yunnan governor.',
  ],
  s0906: [
    'On day jiazi, rivers overflowed in Hubei prefectures and counties including Huangmei; disaster victims were ordered relieved.',
    'On jiazi day, Huangmei and other Hubei counties flooded and victims were to be relieved.',
  ],
  s0907: [
    'On day bingyin, lake waters overflowed in Hunan prefectures and counties including Xiangyin; disaster victims were ordered relieved.',
    'On bingyin day, Xiangyin and other Hunan counties flooded and victims were relieved.',
  ],
  s0908: [
    'On day dingmao, the Emperor accompanied the Empress Dowager on the autumn mulan hunt.',
    'On dingmao day, the Emperor accompanied the Empress Dowager on the autumn mulan hunt.',
  ],
  s0909: [
    'On day guiyou, the Emperor accompanied the Empress Dowager to halt at the Mountain Resort for Summer Retreat.',
    'On guiyou day, the court halted at the Summer Mountain Resort with the Empress Dowager.',
  ],
  s0910: [
    'On day dingchou, flood disaster in Anhui prefectures and counties including Dangtu was relieved.',
    'On dingchou day, Dangtu and other Anhui counties received flood relief.',
  ],
  s0911: [
    'Eighth month, day xinsi: this year\'s drought quota taxes were remitted for thirty-two Gansu prefectures, counties, and subprefectures including Gaolan.',
    'In the eighth month on xinsi, thirty-two Gansu units including Gaolan were excused drought taxes.',
  ],
  s0912: [
    'On day renchen, Aletai and others were instructed to explain to the nine chieftains of Zhuosijia that they should join in attacking Jinchuan.',
    'On renchen day, Aletai was told to rally Zhuosijia\'s nine chiefs for a joint attack on Jinchuan.',
  ],
  s0913: [
    'On day wuxu, the Emperor accompanied the Empress Dowager on a tour to mulan for the enclosure hunt.',
    'On wuxu day, the Empress Dowager toured mulan for the enclosure hunt.',
  ],
  s0914: [
    'Qin Huitian resigned for illness; Liu Lun was ordered to act as Minister of Rites.',
    'Qin Huitian left office ill and Liu Lun acted as Rites minister.',
  ],
  s0915: [
    'On day gengzi, two additional commandant posts were added each at Ili, Yar, and other stations.',
    'On gengzi day, Ili, Yar, and other posts each gained two more commandants.',
  ],
  s0916: [
    'Zhuoketuo was made councillor at Tarbagatai.',
    'Zhuoketuo became Tarbagatai councillor.',
  ],
  s0917: [
    'Wu Mitai and others were ordered to remain at Urumqi on duty.',
    'Wu Mitai and others stayed on at Urumqi.',
  ],
  s0918: [
    'Ninth month, day jiwei: Vice Minister of Punishments Ayong\'a was ordered, together with Wu Dashan, to judge the case of people in Hunan\'s Xinning County who had circulated placards to stop the market.',
    'In the ninth month on jiwei, Ayong\'a and Wu Dashan were to try Xinning\'s placard boycott case.',
  ],
  s0919: [
    'On day guihai, flood disaster in eight Jiangxi counties including Nanchang was relieved and quota taxes remitted.',
    'On guihai day, eight Jiangxi counties including Nanchang were flood-relieved and taxes remitted.',
  ],
  s0920: [
    'On day bingyin, Minister of Punishments Qin Huitian died; Zhuang Yougong replaced him while temporarily retaining Jiangsu governor.',
    'On bingyin day, Qin Huitian died; Zhuang Yougong took his ministry but kept Jiangsu.',
  ],
  s0921: [
    'On day jisi, the Emperor accompanied the Empress Dowager back to halt at the Mountain Resort for Summer Retreat.',
    'On jisi day, the court returned to the Summer Mountain Resort with the Empress Dowager.',
  ],
  s0922: [
    'Winter, tenth month, day guisi: Qiao Guanglie was stripped of office for the Xinning market-stoppage case; Tulebing\'a was transferred to be Hunan governor.',
    'In the tenth month on guisi, Qiao Guanglie lost office over Xinning and Tulebing\'a became Hunan governor.',
  ],
  s0923: [
    'Fang Shijun was made Guizhou governor.',
    'Fang Shijun became Guizhou governor.',
  ],
  s0924: [
    'On day bingshen, Tuoenduo was made Minister of the Court of Colonial Affairs.',
    'On bingshen day, Tuoenduo became Colonial Affairs minister.',
  ],
  s0925: [
    'On day xinchou, Shandong presented peonies as tribute.',
    'On xinchou day, Shandong sent peonies.',
  ],
  s0926: [
    'On day renyin, disaster victims in six Jiangsu prefectures and counties including Shangyuan were relieved.',
    'On renyin day, six Jiangsu units including Shangyuan were relieved.',
  ],
  s0927: [
    'On day guimao, Zhong Yin was summoned to the capital.',
    'On guimao day, Zhong Yin was called to Beijing.',
  ],
  s0928: [
    'Fuming\'an was transferred to Yarkand for duty.',
    'Fuming\'an was sent to Yarkand on duty.',
  ],
  s0929: [
    'On day jiachen, flood disaster in nineteen Anhui prefectures, counties, and garrisons including Huaining was relieved.',
    'On jiachen day, nineteen Anhui units including Huaining received flood relief.',
  ],
  s0930: [
    'Eleventh month, day renzi: drought disaster in twenty Gansu subprefectures, prefectures, and counties including Gaolan was relieved.',
    'In the eleventh month on renzi, twenty Gansu units including Gaolan received drought relief.',
  ],
  s0931: [
    'On day guichou, the walling of Hutubi city was completed and the name Jinghua was bestowed.',
    'On guichou day, Hutubi was finished and named Jinghua.',
  ],
  s0932: [
    'On day bingchen, flood quota taxes were remitted for two Hunan prefectures and counties including Wugang.',
    'On bingchen day, Wugang and one other Hunan county were excused flood taxes.',
  ],
  s0933: [
    'Rain-and-hail disaster in fifteen Gansu subprefectures, prefectures, and counties including Gaolan was relieved.',
    'Fifteen Gansu units including Gaolan received hailstorm relief.',
  ],
  s0934: [
    'On day yichou, Associate Grand Secretary and Minister of Revenue Zhaohui died; the Emperor attended in person to offer mourning.',
    'On yichou day, Zhaohui died and the Emperor mourned him in person.',
  ],
  s0935: [
    'On day dingmao, Arigun was made Minister of Revenue and Associate Grand Secretary.',
    'On dingmao day, Arigun became Revenue minister and associate grand secretary.',
  ],
  s0936: [
    'Tuoenduo was transferred to be Minister of War.',
    'Tuoenduo became War minister.',
  ],
  s0937: [
    'Wuji was made Minister of the Court of Colonial Affairs; Zhaode was made Grand Minister of the Imperial Bodyguard for the Plain Yellow Banner.',
    'Wuji took Colonial Affairs and Zhaode became Plain Yellow Banner bodyguard minister.',
  ],
  s0938: [
    'Twelfth month, first day wuyin: Chang Fu was made councillor at Uliastai.',
    'On the twelfth month\'s wuyin new moon, Chang Fu became Uliastai councillor.',
  ],
  s0939: [
    'On day wuzi, flood disaster in Hubei prefectures and counties including Huangmei was relieved.',
    'On wuzi day, Huangmei and other Hubei counties were flood-relieved.',
  ],
  s0940: [
    'On day jiawu, Minister of Rites Chen Dehua was dismissed for illness; Dong Bangda was transferred to replace him.',
    'On jiawu day, Chen Dehua left Rites ill and Dong Bangda took his place.',
  ],
  s0941: [
    'Yang Tingzhang was made Minister of Works.',
    'Yang Tingzhang became Works minister.',
  ],
  s0942: [
    'Thirtieth year, spring, first month, day wushen: because the Empress Dowager was making her fourth tour of Jiangnan and Zhejiang, unpaid corvée and grain transport from past disasters in Jiangsu, Anhui, and Zhejiang were remitted.',
    'In spring\'s first month on wushen, Jiangsu, Anhui, and Zhejiang disaster arrears in corvée and transport were remitted for the Empress Dowager\'s fourth southern tour.',
  ],
  s0943: [
    'Drought disaster in twenty-nine Gansu subprefectures, prefectures, and counties including Gaolan and flood disaster in four Hubei counties including Jianli were relieved at graded rates.',
    'Twenty-nine Gansu units and four Hubei counties including Jianli received graded drought and flood relief.',
  ],
  s0944: [
    'On day guichou, Liu Lun entered mourning; Zhuang Yougong was ordered as Minister of Punishments to serve as Associate Grand Secretary.',
    'On guichou day, Liu Lun mourned and Zhuang Yougong joined the Grand Secretariat as Punishments minister.',
  ],
  s0945: [
    'Yu Minzhong was made Minister of Revenue.',
    'Yu Minzhong became Revenue minister.',
  ],
  s0946: [
    'Mingde was transferred to be Jiangsu governor; He Qizhong to Shaanxi governor.',
    'Mingde took Jiangsu and He Qizhong Shaanxi.',
  ],
  s0947: [
    'Zhang Bao was made Shanxi governor; Wen Shouhu acted for him.',
    'Zhang Bao became Shanxi governor with Wen Shouhu acting.',
  ],
  s0948: [
    'On day renxu, the Emperor accompanied the Empress Dowager as the imperial procession set out on the southern tour.',
    'On renxu day, the Emperor and Empress Dowager began the southern tour.',
  ],
  s0949: [
    'On day guihai, three-tenths of quota taxes were remitted for prefectures and counties passed through in Zhili and Shandong.',
    'On guihai day, Zhili and Shandong counties on the route were given a three-tenths tax cut.',
  ],
  s0950: [
    'Second month, day wuzi: the Emperor accompanied the Empress Dowager in crossing the river.',
    'In the second month on wuzi, the Emperor and Empress Dowager crossed the river.',
  ],
  s0951: [
    'He inspected the wooden flood-dragons at the east embankment of Qingkou and the Huiji Sluice.',
    'He inspected Qingkou\'s east-embankment flood-dragons and the Huiji Sluice.',
  ],
  s0952: [
    'Agui was ordered to proceed to Ili for duty.',
    'Agui was sent to Ili on duty.',
  ],
  s0953: [
    'On day renchen, old arrears in field-and-corvée and miscellaneous levies on mature land in Jiangsu prefectures and counties before Qianlong year 28 were remitted, and half this year\'s quota taxes for prefectures and counties passed through.',
    'On renchen day, Jiangsu tax arrears before year 28 were cleared and transit counties got half this year\'s quota.',
  ],
  s0954: [
    'On day bingshen, the Emperor accompanied the Empress Dowager in crossing the Yangzi.',
    'On bingshen day, the court crossed the Yangzi with the Empress Dowager.',
  ],
  s0955: [
    'On day jihai, Korea sent tribute.',
    'On jihai day, Korea presented tribute.',
  ],
  s0956: [
    'Intercalary second month, first day bingwu: the Emperor accompanied the Empress Dowager on a visit to Suzhou Prefecture.',
    'On the intercalary second month\'s bingwu new moon, the court visited Suzhou.',
  ],
  s0957: [
    'The Emperor paid homage at the Confucian temple.',
    'The Emperor visited the Confucian temple.',
  ],
  s0958: [
    'On day jiyou, this year\'s corvée silver was remitted for suburban counties of Jiangning, Suzhou, and Hangzhou.',
    'On jiyou day, corvée silver was remitted for counties around Jiangning, Suzhou, and Hangzhou.',
  ],
  s0959: [
    'Half this year\'s quota taxes were remitted for Zhejiang prefectures and counties passed through.',
    'Zhejiang counties on the route got half this year\'s quota remitted.',
  ],
  s0960: [
    'On day xinhai, Chouda was transferred to duty at Yarkand.',
    'On xinhai day, Chouda was sent to Yarkand.',
  ],
  s0961: [
    'Suolin was ordered to proceed to Khüree for duty.',
    'Suolin was sent to Khüree.',
  ],
  s0962: [
    'Erjing\'e was made councillor at Kashgar.',
    'Erjing\'e became Kashgar councillor.',
  ],
  s0963: [
    'On day renzi, the Emperor accompanied the Empress Dowager on a visit to Hangzhou Prefecture.',
    'On renzi day, the court visited Hangzhou.',
  ],
  s0964: [
    'On day yimao, Muslims of Ush rebelled and killed the duty officer Sucheng.',
    'On yimao day, Ush rebels killed the commissioner Sucheng.',
  ],
  s0965: [
    'On day dingsi, Shen Deqian and Qian Chenqun were advanced to Grand Tutor of the Heir Apparent.',
    'On dingsi day, Shen Deqian and Qian Chenqun became Grand Tutors.',
  ],
  s0966: [
    'Mingrui was ordered to advance and suppress Ush.',
    'Mingrui was sent to crush the Ush rebellion.',
  ],
  s0967: [
    'On day gengshen, Mingrui and Erjing\'e were ordered to take general charge of military affairs at Ush; Mingrui was to command all forces.',
    'On gengshen day, Mingrui and Erjing\'e directed Ush operations with Mingrui commanding all troops.',
  ],
  s0968: [
    'Agui and Mingliang were ordered to proceed to Ili for duty.',
    'Agui and Mingliang were sent to Ili.',
  ],
  s0969: [
    'On day xinyou, Shuhede remained at the capital on duty.',
    'On xinyou day, Shuhede stayed in Beijing on duty.',
  ],
  s0970: [
    'Tuoenduo was ordered to act as Minister of Works.',
    'Tuoenduo acted as Works minister.',
  ],
  s0971: [
    'On day wuchen, Mingshan was transferred to be Jiangxi governor; Wang Jian to Guangdong governor; Li Shiyao to act concurrently.',
    'On wuchen day, Mingshan took Jiangxi, Wang Jian Guangdong, and Li Shiyao acted for him.',
  ],
  s0972: [
    'Li Yinpei was made Hubei governor.',
    'Li Yinpei became Hubei governor.',
  ],
  s0973: [
    'On day jisi, the newly walled garrison city at Ili was granted the name Huiyuan; the Muslim quarter at Kash was named Huaishun.',
    'On jisi day, Ili\'s new garrison was named Huiyuan and Kash\'s Muslim quarter Huaishun.',
  ],
  s0974: [
    'On day yihai, last year\'s flood-and-drought quota taxes were remitted for five Jiangsu counties including Shangyuan.',
    'On yihai day, five Jiangsu counties including Shangyuan were excused last year\'s disaster taxes.',
  ],
  s0975: [
    'Third month, first day bingzi: last year\'s flood disaster in seven Hubei prefectures and counties including Hanyang was relieved.',
    'In the third month on bingzi new moon, seven Hubei units including Hanyang received last year\'s flood relief.',
  ],
  s0976: [
    'The Emperor visited Jiaoshan.',
    'The Emperor visited Jiaoshan.',
  ],
  s0977: [
    'On day wuyin, the Emperor accompanied the Empress Dowager in halting at Jiangning Prefecture.',
    'On wuyin day, the court halted at Jiangning.',
  ],
  s0978: [
    'On day renwu, the Emperor went to the tomb of Ming Taizu and offered libation.',
    'On renwu day, the Emperor poured libation at Ming Taizu\'s tomb.',
  ],
  s0979: [
    'He visited Yin Jishan\'s official residence.',
    'He visited Yin Jishan\'s yamen.',
  ],
  s0980: [
    'Guanyinbao suffered defeat in suppressing the rebellious Muslims of Ush.',
    'Guanyinbao was beaten back in the Ush campaign.',
  ],
  s0981: [
    'On day jiashen, Feng Ling was made Hunan governor; Song Bangsui Guangxi governor.',
    'On jiashen day, Feng Ling took Hunan and Song Bangsui Guangxi.',
  ],
  s0982: [
    'On day bingxu, the Emperor accompanied the Empress Dowager in crossing the river.',
    'On bingxu day, the court crossed the river with the Empress Dowager.',
  ],
  s0983: [
    'On day dinghai, Prince Guo Hongshi died.',
    'On dinghai day, Prince Guo Hongshi died.',
  ],
  s0984: [
    'On day jiawu, Grand Secretary Fu Heng and others were graded in the metropolitan personnel review.',
    'On jiawu day, Fu Heng and other grand secretaries received capital review grades.',
  ],
  s0985: [
    'On day yiwei, the Emperor inspected the dyke at Gaojiayan and accompanied the Empress Dowager in crossing the river.',
    'On yiwei day, he inspected Gaojiayan\'s dyke and crossed the river with the Empress Dowager.',
  ],
  s0986: [
    'Yin Jishan was summoned to enter the Grand Council and serve on duty.',
    'Yin Jishan joined the Grand Council.',
  ],
  s0987: [
    'Gao Jin was made governor-general of the Two Jiangs.',
    'Gao Jin became Two-Jiangs governor-general.',
  ],
  s0988: [
    'Li Hong was transferred to be director-general of the Jiangnan waterways; Li Qingshi was made director-general of the Hedong waterways.',
    'Li Hong took Jiangnan rivers and Li Qingshi Hedong rivers.',
  ],
  s0989: [
    'On day renyin, Sucheng was posthumously condemned for greed and debauchery that provoked mutiny; his property was confiscated and his son banished to Ili.',
    'On renyin day, Sucheng was posthumously punished for corruption that sparked revolt; his estate was seized and his son sent to Ili.',
  ],
  s0990: [
    'Nashitong and Katahai were punished with confiscation for concealing defeat.',
    'Nashitong and Katahai lost their estates for hiding defeats.',
  ],
  s0991: [
    'Yonggui was ordered to proceed to Kashgar for duty.',
    'Yonggui was sent to Kashgar.',
  ],
  s0992: [
    'Tuoenduo was ordered to act as Minister of Rites.',
    'Tuoenduo acted as Rites minister.',
  ],
  s0993: [
    'On day guimao, the Emperor crossed the river.',
    'On guimao day, the Emperor crossed the river.',
  ],
  s0994: [
    'Summer, fourth month, first day bingwu: last year\'s hail, flood, drought, and frost disasters in thirty-six Gansu subprefectures, prefectures, and counties including Hezhou were relieved.',
    'In the fourth month on bingwu new moon, thirty-six Gansu units including Hezhou received last year\'s disaster relief.',
  ],
  s0995: [
    'On day gengxu, last year\'s flood quota taxes were remitted for twelve Hubei prefectures, counties, and garrisons including Hanyang.',
    'On gengxu day, twelve Hubei units including Hanyang were excused last year\'s flood taxes.',
  ],
  s0996: [
    'On day xinhai, the posthumous title Wenjian was granted to the late Minister of Punishments Wang Shizhen.',
    'On xinhai day, Wang Shizhen received the posthumous name Wenjian.',
  ],
  s0997: [
    'On day dingsi, the Emperor accompanied the Empress Dowager in halting at Dezhou.',
    'On dingsi day, the court halted at Dezhou.',
  ],
  s0998: [
    'On day gengshen, the Huai-Xu-Hai circuit of Jiangsu was abolished.',
    'On gengshen day, Jiangsu\'s Huai-Xu-Hai circuit was abolished.',
  ],
  s0999: [
    'On day bingyin, the Emperor returned to the capital.',
    'On bingyin day, the Emperor returned to Beijing.',
  ],
  s1000: [
    'On day gengwu, the Emperor went to receive the Empress Dowager as she took up residence at Changchun Garden.',
    'On gengwu day, the Emperor welcomed the Empress Dowager to Changchun Garden.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_012_b10.mjs <translation.json>'
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

const missingSentences = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missingSentences.length) {
  console.error(`Missing: ${missingSentences.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
