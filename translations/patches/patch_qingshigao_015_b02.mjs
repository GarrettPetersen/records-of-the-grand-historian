#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Summer, fourth month, day xinchou: Chang Qing was made general; Heng Rui and Lan Yuanmei were made campaign staff ministers.',
    'In month 4, xinchou, Chang Qing became general and Heng Rui and Lan Yuanmei became campaign staff.',
  ],
  s0102: [
    'Lan Yuanmei was transferred to be Fujian naval commander; Chai Daji acted as Fujian land-route commander.',
    'Lan Yuanmei took the Fujian navy and Chai Daji acted on land.',
  ],
  s0103: [
    'On day wuwu, the Emperor went to Heilongtan to pray for rain.',
    'On wuwu, Hongli prayed for rain at Heilongtan.',
  ],
  s0104: [
    'On day renxu, Shi Zhiguang and one hundred thirty-seven others were granted jinshi graduate status with differing ranks.',
    'On renxu, 137 graduates including Shi Zhiguang received jinshi rank by degree.',
  ],
  s0105: [
    'On day jiazi, the Emperor reviewed the Firearms Battalion troops.',
    'On jiazi, Hongli reviewed the Firearms Battalion.',
  ],
  s0106: [
    'Fifth month, new moon on day dingmao: Uliasutai expedition minister Guntukezhabu was relieved for illness; Sanpeleduoerji replaced him.',
    'On the fifth-month new moon, ill Guntukezhabu left Uliasutai and Sanpeleduoerji replaced him.',
  ],
  s0107: [
    'On day wuchen, Landisi was appointed eastern-route Grand Canal governor.',
    'On wuchen, Landisi became eastern-route canal governor.',
  ],
  s0108: [
    'On day jiaxu, the Emperor set out on the autumn hunt at Mulan.',
    'On jiaxu, Hongli left for the Mulan autumn hunt.',
  ],
  s0109: [
    'On day gengchen, the Emperor halted at the Mountain Resort for Escaping Summer Heat.',
    'On gengchen, Hongli reached the Summer Resort.',
  ],
  s0110: [
    'Miao at Fenghuang subprefecture in Hunan rebelled; regional commander Yin Dexi suppressed them.',
    'Hunan Fenghuang Miao rebelled and Yin Dexi put them down.',
  ],
  s0111: [
    'Sixth month, day gengxu: quota taxes were remitted for tide-scoured land at Renhe field in Zhejiang.',
    'In month 6, gengxu, Zhejiang Renhe tide land lost quota taxes.',
  ],
  s0112: [
    'On day renzi, Chai Daji was made Fujian land-route commander, concurrently managing Taiwan garrison commander affairs.',
    'On renzi, Chai Daji took Fujian land forces and Taiwan garrison affairs.',
  ],
  s0113: [
    'On day bingchen, Fukang\'an was summoned to the imperial camp; Lebao was ordered to act as Shaanxi-Gansu governor-general.',
    'On bingchen, Fukang\'an was recalled and Lebao acted as Shaanxi-Gansu governor-general.',
  ],
  s0114: [
    'Autumn, seventh month, day renchen: Hai Lancha was made campaign staff minister; Shu Liang and Pu\'erpu were made lead commanders, leading guards and clerks to Taiwan to suppress rebels.',
    'In month 7, renchen, Hai Lancha became campaign staff and Shu Liang and Pu\'erpu led guards to Taiwan.',
  ],
  s0115: [
    'On day guisi, relief was given for flood disaster in Anhui prefectures and counties including Huaiyuan and Fengyang.',
    'On guisi, Huaiyuan, Fengyang, and other Anhui flood districts were relieved.',
  ],
  s0116: [
    'Relief was given for drought disaster in nine Shanxi prefectures, departments, and counties including Fengzhen.',
    'Nine Shanxi drought districts including Fengzhen received relief.',
  ],
  s0117: [
    'Eighth month: Chang Qing was dismissed; Fukang\'an was ordered to serve as general and go to Taiwan to supervise military affairs.',
    'In month 8, Chang Qing was dismissed and Fukang\'an took Taiwan command.',
  ],
  s0118: [
    'On day xinhai, the Emperor went to Mulan for the enclosure hunt.',
    'On xinhai, Hongli hunted at Mulan.',
  ],
  s0119: [
    'Ninth month, day renshen: the Emperor returned to halt at the Mountain Resort for Escaping Summer Heat.',
    'In month 9, renshen, Hongli returned to the Summer Resort.',
  ],
  s0120: [
    'On day gengchen, the Emperor returned on his southern progress.',
    'On gengchen, Hongli returned south in progress.',
  ],
  s0121: [
    'On day renwu, Chai Daji was transferred to be Fujian naval commander; Cai Panlong was made Fujian land-route commander and also granted campaign staff rank.',
    'On renwu, Chai Daji took the Fujian navy and Cai Panlong took land forces with campaign staff rank.',
  ],
  s0122: [
    'On day xinmao, because Zhuluo was still under siege, Fukang\'an was urged to strike directly at rebel Dalikuo and also to divide troops to advance up the Dajia River.',
    'On xinmao, with Zhuluo still besieged, Fukang\'an was told to hit Dalikuo and send a column up the Dajia River.',
  ],
  s0123: [
    'Winter, tenth month, day dingwei: Fu Chang\'an was ordered to act as Minister of Works.',
    'On the tenth-month dingwei, Fu Chang\'an acted as works minister.',
  ],
  s0124: [
    'On day wushen, Fu Mausoleum was repaired.',
    'On wushen, Fu Mausoleum was repaired.',
  ],
  s0125: [
    'On day dingwei, the breach at the lower flood segment of Suizhou was closed.',
    'On dingwei, the Suizhou lower breach was closed.',
  ],
  s0126: [
    'On day bingchen, Agui was ordered to go to Jiangnan to survey dikes at Gaoyan and elsewhere.',
    'On bingchen, Agui was sent to survey Jiangnan dikes at Gaoyan and elsewhere.',
  ],
  s0127: [
    'On day wuwu, this year\'s grain-transport rice and levies were remitted for twenty-three Jiangsu prefectures and counties including Qinghe and five guards including Huai\'an for flood disaster, with differing amounts.',
    'On wuwu, twenty-three Jiangsu counties and five Huai\'an guards lost this year\'s transport grain levies from flood, by degree.',
  ],
  s0128: [
    'On day xinyou, because Fuzhou general Heng Rui had been timid in suppressing rebels, he was summoned to the capital and E Hui replaced him.',
    'On xinyou, timid Heng Rui was recalled and E Hui became Fuzhou general.',
  ],
  s0129: [
    'Relief was given for drought disaster in seven Zhili prefectures and counties including Bao\'an.',
    'Seven Zhili drought counties including Bao\'an were relieved.',
  ],
  s0130: [
    'On day renxu, Jiangsu and Zhejiang were each ordered to allocate fifty thousand strings of cash to supply Fujian military needs.',
    'On renxu, Jiangsu and Zhejiang each sent fifty thousand strings for Fujian supplies.',
  ],
  s0131: [
    'Eleventh month, new moon on day jiazi: Li Shiyao and Sun Shiyi were raised to Grand Guardian of the Heir Apparent; Chai Daji to Junior Guardian of the Heir Apparent.',
    'On the eleventh-month new moon, Li Shiyao and Sun Shiyi became grand guardians and Chai Daji junior guardian.',
  ],
  s0132: [
    'Imperial calligraphy plaques were granted to the Guangdong and Quanzhou loyalist villages in Taiwan.',
    'Taiwan\'s Guangdong and Quanzhou loyalist villages received imperial plaques.',
  ],
  s0133: [
    'On day renshen, because Chai Daji had held firm at Chiayi, he was enfeoffed as a first-class Baron of Righteous Courage, hereditary.',
    'On renshen, Chai Daji became a hereditary first-class Baron of Righteous Courage for holding Chiayi.',
  ],
  s0134: [
    'Quota taxes for the fifty-fourth year were remitted for Chiayi county in Taiwan.',
    'Chiayi in Taiwan lost its year-54 quota taxes.',
  ],
  s0135: [
    'Bayansan was admonished for memorializing that the Dalai Lama had sent envoys he called "barbarian envoys."',
    'Bayansan was rebuked for calling the Dalai Lama\'s envoys "barbarian envoys."',
  ],
  s0136: [
    'On day yiyou, Kui Lin was stripped of office and arrested for greed; Baoning was made Yili general.',
    'On yiyou, greedy Kui Lin was arrested and Baoning became Yili general.',
  ],
  s0137: [
    'Li Shijie was transferred to be Sichuan governor-general; Shu Lin was made Liangjiang governor-general; Chen Yongfu was made Anhui governor.',
    'Li Shijie took Sichuan; Shu Lin, Liangjiang; Chen Yongfu, Anhui.',
  ],
  s0138: [
    'Twelfth month, day dingwei: Fukang\'an and others defeated rebels at Lunzaiding village and elsewhere, lifted the siege of Chiayi, and Fukang\'an and Hai Lancha were advanced to dukes, each granted a ruby finial and a four-round-dragon rank robe.',
    'In month 12, dingwei, Fukang\'an broke rebels at Lunzaiding, relieved Chiayi, and he and Hai Lancha became dukes with ruby finials and four-dragon robes.',
  ],
  s0139: [
    'On day jiyou, Chang Qing was transferred to be Fuzhou general.',
    'On jiyou, Chang Qing became Fuzhou general.',
  ],
  s0140: [
    'Shu Chang was made Huguang governor-general; Fu Chang\'an was made Minister of Works.',
    'Shu Chang took Huguang and Fu Chang\'an took works.',
  ],
  s0141: [
    'Because Fukang\'an had impeached Chai Daji and Cai Panlong for overstating their battle merits, an edict stated: "Chai Daji held to his decision and strove to defend.',
    'After Fukang\'an attacked Chai Daji and Cai Panlong for inflated merit, Hongli ruled: "Chai Daji held firm and defended to the limit.',
  ],
  s0142: [
    'Cai Panlong fought bravely, killing rebels, and actually reached the county seat.',
    'Cai Panlong fought hard, killed rebels, and reached the county seat.',
  ],
  s0143: [
    'Perhaps they were not careful in etiquette before Fukang\'an, causing his dislike.',
    'Perhaps they offended Fukang\'an in etiquette and he turned against them.',
  ],
  s0144: [
    'How can their merits be erased and groundless charges rushed upon them?"',
    'How can merit be denied and baseless charges piled on?"',
  ],
  s0145: [
    'Because Sun Shiyi had moved troops and transported weapons without regard to administrative boundaries, double-eyed peacock feathers were granted.',
    'Sun Shiyi was granted double peacock feathers for moving troops and supplies across boundaries.',
  ],
  s0146: [
    'On day wuwu, because Decheng had reported Chai Daji\'s greed and dereliction, Fukang\'an and Li Shiyao were ordered to impeach on the facts; Yade, Kashgar affairs minister, was arrested for having covered for him when he was in Fujian.',
    'On wuwu, Decheng\'s charge of Chai Daji\'s greed sent Fukang\'an and Li Shiyao to impeach on facts and Yade was arrested for Fujian cover-up.',
  ],
  s0147: [
    'On day gengshen, Wulana was ordered to act as Fujian governor.',
    'On gengshen, Wulana acted as Fujian governor.',
  ],
  s0148: [
    'Yongduo was made Mukden general; Shang\'an was made Urumqi military governor.',
    'Yongduo became Mukden general and Shang\'an, Urumqi governor.',
  ],
  s0149: [
    'Fifty-third year, spring, first month, day dingmao: this year\'s quota taxes were remitted for twenty Fujian counties including Jinjiang through which troops had passed, with differing amounts.',
    'In year 53, month 1, dingmao, twenty Fujian troop-route counties including Jinjiang lost this year\'s taxes, by degree.',
  ],
  s0150: [
    'On day xinwei, Ming Xing memorialized that the river had cleared at Yongning and elsewhere in Shanxi.',
    'On xinwei, Ming Xing reported the river clear at Shanxi Yongning and elsewhere.',
  ],
  s0151: [
    'On day bingxu, Chai Daji was stripped of office and arrested for trial.',
    'On bingxu, Chai Daji was stripped and arrested.',
  ],
  s0152: [
    'Fuzhou general Chang Qing was stripped of office for covering for Chai Daji.',
    'Chang Qing lost Fuzhou for covering Chai Daji.',
  ],
  s0153: [
    'Second month, new moon on day jiawu: Lin Shuangwen was captured; Fukang\'an and Hai Lancha were granted imperial pouches; officers were rewarded by degree.',
    'On the second-month new moon, Lin Shuangwen was taken; Fukang\'an and Hai Lancha got imperial pouches and officers were rewarded.',
  ],
  s0154: [
    'Grand Secretary Heshen was advanced to third-class earl.',
    'Heshen was raised to a third-class earl.',
  ],
  s0155: [
    'Grand Secretaries Agui and Wang Jie and Ministers Fu Chang\'an and Dong Gao were entered for merit registers.',
    'Agui, Wang Jie, Fu Chang\'an, and Dong Gao received merit registers.',
  ],
  s0156: [
    'Sun Shiyi was granted a hereditary Commandant of Light Chariots.',
    'Sun Shiyi received a hereditary chariot commandancy.',
  ],
  s0157: [
    'On day yiwei, Huang Shijian and Ren Chengen were released.',
    'On yiwei, Huang Shijian and Ren Chengen were freed.',
  ],
  s0158: [
    'On day renyin, Yili expedition minister Hailu was stripped of office for a false impeachment of Kui Lin; both were punished to serve as bondsmen.',
    'On renyin, Hailu lost Yili for false charges against Kui Lin and both served as bondsmen.',
  ],
  s0159: [
    'On day yisi, a Five Classics Erudite was established for the descendant of the ancient sage Youzi.',
    'On yisi, Youzi\'s line received a Five Classics erudite.',
  ],
  s0160: [
    'On day xinhai, the Emperor made a progress tour to Tianjin.',
    'On xinhai, Hongli toured Tianjin.',
  ],
  s0161: [
    'On day gengshen, Taiwan rebel chief Zhuang Datian was captured; regional commander Xu Shiheng and others were rewarded by degree.',
    'On gengshen, Zhuang Datian was taken and Xu Shiheng and other officers were rewarded.',
  ],
  s0162: [
    'On day xinyou, tax arrears in Tianjin prefecture were remitted.',
    'On xinyou, Tianjin tax arrears were forgiven.',
  ],
  s0163: [
    'On day renxu, the Emperor reviewed troops at the Military Review Pavilion.',
    'On renxu, Hongli reviewed troops at the Review Pavilion.',
  ],
  s0164: [
    'Third month, day wuchen: Vice Minister Mu Jing\'a was ordered to go to Hubei to join Shu Chang in investigating a case.',
    'In month 3, wuchen, Mu Jing\'a was sent to Hubei with Shu Chang to investigate.',
  ],
  s0165: [
    'On day renshen, Lin Shuangwen was executed.',
    'On renshen, Lin Shuangwen was executed.',
  ],
  s0166: [
    'On day guiwei, Fukang\'an and Hai Lancha were again granted purple reins, golden-braided coral court beads, and Fukang\'an a golden yellow belt.',
    'On guiwei, Fukang\'an and Hai Lancha again received purple reins, coral beads, and Fukang\'an a golden yellow belt.',
  ],
  s0167: [
    'Summer, fourth month, day xinchou: because of drought, the Ministry of Punishments reduced sentences for penal servitude and below.',
    'In month 4, xinchou, drought brought reduced sentences below penal servitude.',
  ],
  s0168: [
    'On day bingwu, the Emperor reviewed the Vanguard Camp troops.',
    'On bingwu, Hongli reviewed the Vanguard Camp.',
  ],
  s0169: [
    'On day gengxu, last year\'s quota taxes were remitted for eighteen Jiangsu prefectures and counties including Qinghe and five guards including Huai\'an for flood disaster, with differing amounts.',
    'On gengxu, eighteen Jiangsu counties and five Huai\'an guards lost last year\'s flood taxes, by degree.',
  ],
  s0170: [
    'On day jiwei, Fulehun and Yade were sentenced to strangulation for failing to supervise Chai Daji.',
    'On jiwei, Fulehun and Yade were condemned to strangulation for lax oversight of Chai Daji.',
  ],
  s0171: [
    'Fifth month, day dingmao: last year\'s quota taxes were remitted for six Henan prefectures and counties including Shangqiu for flood disaster, with differing amounts.',
    'In month 5, dingmao, six Henan flood counties including Shangqiu lost last year\'s taxes, by degree.',
  ],
  s0172: [
    'On day guiyou, last year\'s quota taxes on civilian and banner land were remitted for seven Zhili prefectures and counties including Bao\'an for flood disaster.',
    'On guiyou, seven Zhili flood counties including Bao\'an lost last year\'s civilian and banner land taxes.',
  ],
  s0173: [
    'On day gengchen, the Emperor set out on the autumn hunt at Mulan.',
    'On gengchen, Hongli left for the Mulan autumn hunt.',
  ],
  s0174: [
    'On day guiwei, Chang Qing\'s crimes were pardoned.',
    'On guiwei, Chang Qing was pardoned.',
  ],
  s0175: [
    'On day gengyin, relief was given to refugees in Taiwan.',
    'On gengyin, Taiwan refugees were relieved.',
  ],
  s0176: [
    'Sixth month, day bingshen: Fugang memorialized that Burma\'s Mengyun had sent envoys including Yemiaoruidong bearing gold-leaf memorials as tribute; an order instructed that they be escorted quickly to the imperial camp.',
    'In month 6, bingshen, Fugang reported Burmese tribute envoys and Hongli ordered them rushed to camp.',
  ],
  s0177: [
    'On day wuxu, relief was given for flood disaster in Xupu county, Hunan.',
    'On wuxu, Xupu in Hunan received flood relief.',
  ],
  s0178: [
    'Last year\'s quota taxes were remitted for four Anhui prefectures, departments, and guards including Fengyang for flood disaster, with differing amounts.',
    'Four Anhui districts including Fengyang lost last year\'s flood taxes, by degree.',
  ],
  s0179: [
    'On day xinchou, relief was given for flood disaster in Changyang county, Hubei.',
    'On xinchou, Changyang in Hubei received flood relief.',
  ],
  s0180: [
    'On day dingwei, quota taxes for the fifty-first year were remitted for three Shaanxi prefectures and counties including Huazhou for flood disaster.',
    'On dingwei, three Shaanxi counties including Huazhou lost year-51 flood taxes.',
  ],
  s0181: [
    'On day wushen, the Annamese Nguyễn Huệ and others rebelled and expelled their king Lê Duy Kỳ; Kỳ came seeking aid.',
    'On wushen, Nguyễn Huệ expelled King Lê Duy Kỳ, who fled to seek aid.',
  ],
  s0182: [
    'Sun Shiyi was ordered to go to Guangxi to soothe and instruct.',
    'Sun Shiyi was sent to Guangxi to reassure them.',
  ],
  s0183: [
    'Last year\'s quota taxes were remitted for nine Shanxi prefectures and counties including Datong for drought disaster.',
    'Nine Shanxi drought counties including Datong lost last year\'s taxes.',
  ],
  s0184: [
    'Autumn, seventh month, new moon on day xinyou: because the Annam horse official Nguyễn Huy Tú had brought Lê Duy Kỳ\'s mother and son as refugees, Sun Shiyi and others were instructed to comfort and support them.',
    'On the seventh-month new moon, Nguyễn Huy Tú brought Lê Duy Kỳ\'s kin and Sun Shiyi was told to care for them.',
  ],
  s0185: [
    'On day renxu, relief was given for flood disaster in Jiaozhou and Shouguang in Shandong.',
    'On renxu, Jiaozhou and Shouguang in Shandong received flood relief.',
  ],
  s0186: [
    'The Yangtze overflowed at Jingzhou in Hubei; both the prefectural city and the Manchu city were inundated; Shu Chang and others were instructed to survey and relieve.',
    'Jingzhou\'s Yangtze flood drowned both cities and Shu Chang was told to survey and relieve.',
  ],
  s0187: [
    'On day dingchou, Li Shiyao\'s earldom was restored; his heir Li Fengyao was granted regional commander rank on present inheritance.',
    'On dingchou, Li Shiyao regained his earldom and heir Li Fengyao received regional commander rank.',
  ],
  s0188: [
    'On day wuyin, the Yangtze overflowed at Wuchang and Hanyang in Hubei.',
    'On wuyin, the Yangtze flooded Wuchang and Hanyang.',
  ],
  s0189: [
    'Bi Yuan was made Huguang governor-general; Wulana was made Henan governor; Ming Xing was made Ushi affairs minister.',
    'Bi Yuan took Huguang; Wulana, Henan; Ming Xing, Ushi.',
  ],
  s0190: [
    'Relief was given for flood disaster in Anhui prefectures and counties including Huaining.',
    'Huaining and other Anhui flood districts were relieved.',
  ],
  s0191: [
    'Chai Daji was executed.',
    'Chai Daji was executed.',
  ],
  s0192: [
    'Jiang Sheng was summoned to the capital; Huiling was made Hubei governor.',
    'Jiang Sheng was recalled and Huiling became Hubei governor.',
  ],
  s0193: [
    'On day wuzi, Gurkhas occupied Gyirong and Nyalam in rear Tibet; Chengde and Mukedeng\'a were ordered to suppress them.',
    'On wuzi, Gurkhas took Gyirong and Nyalam and Chengde and Mukedeng\'a were sent to fight them.',
  ],
  s0194: [
    'Eighth month, day jiachen: relief was given for flood disaster in Jianli and Shishou in Hubei.',
    'In month 8, jiachen, Jianli and Shishou in Hubei received flood relief.',
  ],
  s0195: [
    'On day bingwu, the Emperor went to Mulan.',
    'On bingwu, Hongli went to Mulan.',
  ],
  s0196: [
    'On day gengxu, because of great flooding at Mulan, the enclosure hunt was stopped.',
    'On gengxu, Mulan flooding stopped the enclosure hunt.',
  ],
  s0197: [
    'On day guichou, Gurkhas again took Dzongkha; E Hui was made general and Chengde campaign staff minister to suppress them.',
    'On guichou, Gurkhas retook Dzongkha and E Hui became general with Chengde as campaign staff.',
  ],
  s0198: [
    'On day bingchen, Nguyễn Huệ and others fled; Sun Shiyi was ordered to supervise Xu Shiheng\'s advance against them; Fugang was ordered to command troops stationed at Mengzi.',
    'On bingchen, Nguyễn Huệ fled; Sun Shiyi directed Xu Shiheng\'s advance and Fugang garrisoned Mengzi.',
  ],
  s0199: [
    'On day wuwu, the Emperor returned to halt at the Mountain Resort for Escaping Summer Heat.',
    'On wuwu, Hongli returned to the Summer Resort.',
  ],
  s0200: [
    'Ninth month, day renxu: Burmese chiefs including Xihajuekong had an audience; an order stated that Siam and Burma were now both submitted and the two countries should keep peace and not resume former hostilities.',
    'In month 9, renxu, Burmese chiefs had audience and Hongli told Siam and Burma to keep peace now that both had submitted.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_015_b02.mjs <translation.json>'
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
