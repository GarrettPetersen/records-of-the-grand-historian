#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Fifty-first year, spring, first month, new moon on day bingwu: there was a solar eclipse; court congratulations were dispensed with.',
    'In Qianlong 51, on the first-month new moon, bingwu, an eclipse canceled court congratulations.',
  ],
  s0002: [
    'On day wushen, the Ministry of Revenue was ordered to allocate one million taels of silver to be sent to Anhui for disaster-relief preparation.',
    'On wushen, Revenue allocated one million taels for Anhui famine relief.',
  ],
  s0003: [
    'On day xinyou, Minister of Rites Yao Chenglie died; Peng Yuanrui was appointed to replace him.',
    'On xinyou, Yao Chenglie died; Peng Yuanrui took the rites ministry.',
  ],
  s0004: [
    'On day bingyin, Pufu was made Tibet resident commissioner.',
    'On bingyin, Pufu became Tibet resident commissioner.',
  ],
  s0005: [
    'On day gengwu, Jiangxi Governor He Yucheng memorialized that grain prices rose daily, caused by excessive trafficking from Jiang and Chu.',
    'On gengwu, He Yucheng blamed Jiang-Chu grain trafficking for rising Jiangxi prices.',
  ],
  s0006: [
    'The Emperor, minded to restrain grain hoarding, rebuked him severely.',
    'Hongli, intent on curbing hoarding, rebuked him sharply.',
  ],
  s0007: [
    'Fan Jianzhong was ordered to go to Hami on business.',
    'Fan Jianzhong was sent to Hami.',
  ],
  s0008: [
    'Second month, day gengchen: the Emperor attended the Classics Lecture and granted a feast, ordering craftsmen to sing newly composed admonitory restraint verses—the practice was made annual.',
    'In month 2, gengchen, Hongli lectured, feasted, and made annual the singing of new admonitory verses.',
  ],
  s0009: [
    'Fujian naval commander Huang Shijian was additionally granted the rank of Grand Guardian of the Heir Apparent.',
    'Huang Shijian was made Grand Guardian of the Heir Apparent.',
  ],
  s0010: [
    'On day yiyou, the Emperor went to the Southern Park for the enclosure hunt.',
    'On yiyou, Hongli hunted at the Southern Park.',
  ],
  s0011: [
    'On day xinmao, Ministers Cao Wenpei, Jiang Sheng, and Yiling\'a were ordered to go to Zhejiang to audit granaries and storehouses.',
    'On xinmao, Cao Wenpei, Jiang Sheng, and Yiling\'a were sent to audit Zhejiang granaries.',
  ],
  s0012: [
    'On day renchen, the Emperor went to the Western Tombs, made a progress tour of Mount Wutai, and remitted one-tenth of quota taxes for places along the route.',
    'On renchen, Hongli worshipped at the Western Tombs, toured Wutai, and forgave a tenth of route taxes.',
  ],
  s0013: [
    'On day bingshen, the Emperor paid rites at Tailing and Tai East Tombs.',
    'On bingshen, Hongli worshipped at Tailing and Tai East Tombs.',
  ],
  s0014: [
    'On day dingyou, last year\'s disaster arrears in silver and grain were remitted for subordinate districts of three Zhili prefectures—Shunde, Guangping, and Daming.',
    'On dingyou, Shunde, Guangping, and Daming lost last year\'s disaster arrears.',
  ],
  s0015: [
    'On day jihai, Tusaibu was made Hubei governor.',
    'On jihai, Tusaibu took Hubei.',
  ],
  s0016: [
    'On day guimao, tax arrears were remitted for six prefectures and counties in Shanxi including Xinzhou.',
    'On guimao, six Shanxi districts including Xinzhou lost tax arrears.',
  ],
  s0017: [
    'Third month, day bingwu: the Emperor halted at Mount Wutai.',
    'In month 3, bingwu, Hongli halted at Mount Wutai.',
  ],
  s0018: [
    'On day bingchen, Liang-Jiang Governor-General Sa Zai died; Li Shijie was transferred to replace him.',
    'On bingchen, Sa Zai died; Li Shijie took Liang-Jiang.',
  ],
  s0019: [
    'Baoning was made Sichuan governor-general; Ehui was made Chengdu general.',
    'Baoning took Sichuan; Ehui, Chengdu.',
  ],
  s0020: [
    'On day jiwei, the Emperor inspected the Hutuo River and reviewed troops at Zhengding garrison.',
    'On jiwei, Hongli inspected the Hutuo and Zhengding troops.',
  ],
  s0021: [
    'On day renxu, the Emperor sacrificed at the temple of Emperor Yao.',
    'On renxu, Hongli sacrificed at the Yao temple.',
  ],
  s0022: [
    'On day guihai, Li Shiyao was ordered to act as Minister of Revenue.',
    'On guihai, Li Shiyao acted as revenue minister.',
  ],
  s0023: [
    'On day jiazi, disaster victims in three counties in Shaanxi including Chaoyi were given relief.',
    'On jiazi, three Shaanxi counties including Chaoyi received relief.',
  ],
  s0024: [
    'On day gengwu, the Emperor returned to the capital.',
    'On gengwu, Hongli returned to Beijing.',
  ],
  s0025: [
    'On day xinwei, Yiling\'a was made Zhejiang governor.',
    'On xinwei, Yiling\'a took Zhejiang.',
  ],
  s0026: [
    'Summer, fourth month, day jimao: Grand Secretary Agui was ordered to go to Jiangnan to plan river works.',
    'In month 4, jimao, Agui was sent to Jiangnan for river works.',
  ],
  s0027: [
    'On day yiyou, Zhejiang education intendant Dou Guangnong memorialized that deficits in Jiaxing, Haiyan, and Pingyang counties each exceeded 100,000; prefectures and counties purchasing for granary storage all collected in silver for ease of diversion.',
    'On yiyou, Dou Guangnong reported 100,000-tael deficits in three Zhejiang counties and silver collection for granary purchases.',
  ],
  s0028: [
    'Cao Wenpei and others were ordered to investigate strictly and report back.',
    'Cao Wenpei and others were ordered to investigate and report.',
  ],
  s0029: [
    'Water disaster relief was given for six prefectures and counties in Shanxi including Daizhou.',
    'Six Shanxi districts including Daizhou received flood relief.',
  ],
  s0030: [
    'On day jichou, Dou Guangnong was ordered to join Cao Wenpei and others in investigating and handling Zhejiang deficits.',
    'On jichou, Dou Guangnong joined Cao Wenpei in investigating Zhejiang deficits.',
  ],
  s0031: [
    'Fifth month, day bingwu: Agui was ordered to go to Zhejiang, join Cao Wenpei and others in investigating deficits, and survey sea dikes.',
    'In month 5, bingwu, Agui was sent to Zhejiang to probe deficits and survey sea dikes.',
  ],
  s0032: [
    'On day bingchen, Fulehun was stripped of office and handed over to Agui and others for trial.',
    'On bingchen, Fulehun was stripped and handed to Agui for trial.',
  ],
  s0033: [
    'On day dingsi, Sun Shiyi was made Liang-Guang governor-general; Tusaibu was transferred to be Guangdong governor; Li Feng was made Hubei governor.',
    'On dingsi, Sun Shiyi took Liang-Guang; Tusaibu, Guangdong; Li Feng, Hubei.',
  ],
  s0034: [
    'On day jiwei, Li Shiyao was ordered to act as Huguang governor-general.',
    'On jiwei, Li Shiyao acted as Huguang governor-general.',
  ],
  s0035: [
    'On day xinwei, the Emperor went on the autumn hunt at Mulan.',
    'On xinwei, Hongli went to the Mulan autumn hunt.',
  ],
  s0036: [
    'Earthquake disaster relief was given for Dajianlu and elsewhere in Sichuan.',
    'Dajianlu and other Sichuan earthquake districts received relief.',
  ],
  s0037: [
    'That month, last year\'s drought quota taxes were remitted for fifty-six prefectures, counties, and guards in Jiangsu including Shangyuan.',
    'That month, fifty-six Jiangsu districts including Shangyuan lost last year\'s drought taxes.',
  ],
  s0038: [
    'Sixth month, day dingchou: the Emperor halted at the Mountain Resort for Escaping Summer Heat.',
    'In month 6, dingchou, Hongli reached the Summer Resort.',
  ],
  s0039: [
    'On day yiyou, Fusong was ordered to act as Shanxi governor.',
    'On yiyou, Fusong acted as Shanxi governor.',
  ],
  s0040: [
    'On day dinghai, the Yuan River overflowed in Changde prefecture, Hunan.',
    'On dinghai, the Yuan overflowed at Changde, Hunan.',
  ],
  s0041: [
    'On day xinchou, Fu Gang was transferred to be Min-Zhe governor-general; Tekse was made Yunnan-Guizhou governor-general.',
    'On xinchou, Fu Gang took Min-Zhe and Tekse Yunnan-Guizhou.',
  ],
  s0042: [
    'Bi Yuan was made Huguang governor-general; Jiang Lan was made Henan governor.',
    'Bi Yuan took Huguang; Jiang Lan, Henan.',
  ],
  s0043: [
    'Autumn, seventh month, day wushen: last year\'s drought quota taxes were remitted for twelve prefectures and counties in Henan including Shangqiu.',
    'In month 7, wushen, twelve Henan districts including Shangqiu lost last year\'s drought taxes.',
  ],
  s0044: [
    'On day renzi, the river overflowed at Li Family Estate, Qinghe, Jiangsu.',
    'On renzi, the Qinghe breached at Li Family Estate.',
  ],
  s0045: [
    'On day dingsi, Agui was ordered to proceed from Zhejiang to Qingkou, join Li Shijie and others in handling damming and embankment work.',
    'On dingsi, Agui was sent from Zhejiang to Qingkou with Li Shijie to dam the breach.',
  ],
  s0046: [
    'On day jisi, Cao Xibao impeached Heshen\'s servant Liu Quan but could not substantiate it; by grace he was dismissed from office but retained in post.',
    'On jisi, Cao Xibao failed to prove charges against Heshen\'s servant Liu Quan and was dismissed yet kept in post.',
  ],
  s0047: [
    'Intercalary seventh month, day gengchen: Grand Secretary and Baron Wumitai died.',
    'In the intercalary seventh month, gengchen, Baron Wumitai died.',
  ],
  s0048: [
    'Liu Bingtian was summoned to the capital; Tan Shangzhong was made Yunnan governor.',
    'Liu Bingtian was recalled; Tan Shangzhong took Yunnan.',
  ],
  s0049: [
    'On day jichou, Zhejiang education intendant and Right Vice Minister of Personnel Dou Guangnong was stripped of office.',
    'On jichou, Dou Guangnong lost his posts as Zhejiang intendant and personnel vice minister.',
  ],
  s0050: [
    'On day gengyin, Fulehun was sentenced to decapitation.',
    'On gengyin, Fulehun was sentenced to death.',
  ],
  s0051: [
    'On day yiwei, Heshen was made Grand Secretary of the Hall of Literary Glory and ordered to manage Revenue affairs.',
    'On yiwei, Heshen joined the Wenhua Grand Secretariat and took charge of revenue.',
  ],
  s0052: [
    'Fukang\'an was made Minister of Personnel and Associate Grand Secretary, remaining at his post as Shaanxi-Gansu governor-general.',
    'Fukang\'an became personnel minister and associate grand secretary while staying at Shaanxi-Gansu.',
  ],
  s0053: [
    'Fu Chang\'an was made Minister of Revenue; Chuoketuo was ordered to act as Minister of War.',
    'Fu Chang\'an took revenue; Chuoketuo acted at war.',
  ],
  s0054: [
    'On day wuxu, relief was given for flood disaster in Wuling and Longyang, Hunan.',
    'On wuxu, Wuling and Longyang received flood relief.',
  ],
  s0055: [
    'Eighth month, day bingchen: the Emperor went to Mulan for the enclosure hunt.',
    'In month 8, bingchen, Hongli hunted at Mulan.',
  ],
  s0056: [
    'On day gengshen, Songchun was transferred to be Suiyuan garrison general; Jifu was made Ningxia general.',
    'On gengshen, Songchun took Suiyuan and Jifu, Ningxia.',
  ],
  s0057: [
    'Ninth month, day wuyin: the Emperor halted at the Mountain Resort for Escaping Summer Heat.',
    'In month 9, wuyin, Hongli returned to the Summer Resort.',
  ],
  s0058: [
    'On day dinghai, Lebao was made Shanxi governor.',
    'On dinghai, Lebao took Shanxi.',
  ],
  s0059: [
    'On day wuzi, Yongbao was made Tarbagatai deputy commissioner.',
    'On wuzi, Yongbao became Tarbagatai deputy commissioner.',
  ],
  s0060: [
    'Bayansan was made Shaanxi governor.',
    'Bayansan took Shaanxi.',
  ],
  s0061: [
    'On day renchen, the Emperor returned to the capital.',
    'On renchen, Hongli returned to Beijing.',
  ],
  s0062: [
    'On day jiawu, Fu Chang\'an was transferred to act as Minister of War; Chuoketuo was ordered to act as Minister of Revenue.',
    'On jiawu, Fu Chang\'an acted at war and Chuoketuo at revenue.',
  ],
  s0063: [
    'On day yiwei, Langgan was made Zhejiang governor.',
    'On yiwei, Langgan took Zhejiang.',
  ],
  s0064: [
    'On day jihai, the Emperor\'s eldest grandson, Beile Miande, died.',
    'On jihai, Beile Miande, the eldest imperial grandson, died.',
  ],
  s0065: [
    'Flood disaster relief was given for seventeen prefectures and counties in Anhui including Wuhe and five guards including Fengyang.',
    'Seventeen Anhui counties and five guards including Fengyang received flood relief.',
  ],
  s0066: [
    'Winter, tenth month, new moon on day xinchou: Fu Gang was transferred to be Yunnan-Guizhou governor-general; Changqing was made Min-Zhe governor-general.',
    'On the tenth-month new moon, Fu Gang took Yunnan-Guizhou and Changqing Min-Zhe.',
  ],
  s0067: [
    'On day dingwei, Bi Yuan was demoted to Henan governor again; Jiang Lan to Henan provincial administration commissioner again; Li Shiyao was appointed Huguang governor-general.',
    'On dingwei, Bi Yuan and Jiang Lan were demoted in Henan and Li Shiyao took Huguang.',
  ],
  s0068: [
    'On day dingsi, quota taxes were remitted with differing amounts for disaster in four prefectures and counties in Zhili including Anzhou.',
    'On dingsi, four Zhili disaster counties including Anzhou lost taxes by degree.',
  ],
  s0069: [
    'Eleventh month: flood disaster relief was given for seventeen prefectures and counties in Anhui including Hefei.',
    'In month 11, seventeen Anhui counties including Hefei received flood relief.',
  ],
  s0070: [
    'Twelfth month, day xinchou: bandits Chen Jian and others in Nanjing county, Fujian, made trouble; they were captured and punished.',
    'In month 12, xinchou, Chen Jian\'s gang in Nanjing county was captured.',
  ],
  s0071: [
    'On day renzi, Grand Secretary Liang Guozhi died.',
    'On renzi, Liang Guozhi died.',
  ],
  s0072: [
    'Minister of War Wang Jie was ordered to serve in the Grand Council.',
    'Wang Jie joined the Grand Council.',
  ],
  s0073: [
    'On day wuwu, Zheng Hua was enfeoffed as King of Siam.',
    'On wuwu, Zheng Hua was enfeoffed king of Siam.',
  ],
  s0074: [
    'On day bingyin, bandit Lin Shuangwen in Zhanghua county, Fujian, made trouble, captured the county seat; Magistrate Yu Jun died in the fighting.',
    'On bingyin, Lin Shuangwen seized Zhanghua and Magistrate Yu Jun fell.',
  ],
  s0075: [
    'Changqing, Xu Siceng, and others were ordered to suppress them.',
    'Changqing and Xu Siceng were ordered to suppress the rebels.',
  ],
  s0076: [
    'That year, Korea, Ryukyu, and Siam sent tribute.',
    'Korea, Ryukyu, and Siam sent tribute that year.',
  ],
  s0077: [
    'Fifty-second year, spring, first month, day xinwei: Lin Shuangwen captured Zhuluo and Zhuzhai.',
    'In Qianlong 52, xinwei, Lin Shuangwen took Zhuluo and Zhuzhai.',
  ],
  s0078: [
    'On day guiyou, Ehui was ordered to act as Sichuan governor-general.',
    'On guiyou, Ehui acted as Sichuan governor-general.',
  ],
  s0079: [
    'On day yihai, Fulehun\'s crime was pardoned.',
    'On yihai, Fulehun was pardoned.',
  ],
  s0080: [
    'On day dingchou, Li Shiyao was transferred to be Min-Zhe governor-general; Changqing to Huguang governor-general, remaining in Fujian to supervise military affairs; Shu Chang was ordered to act for him.',
    'On dingchou, Li Shiyao took Min-Zhe, Changqing Huguang while staying in Fujian, and Shu Chang acted for him.',
  ],
  s0081: [
    'On day guiwei, Lin Shuangwen captured Fengshan; Magistrate Tang Daquan died in the fighting.',
    'On guiwei, Lin Shuangwen took Fengshan and Magistrate Tang Daquan fell.',
  ],
  s0082: [
    'On day jiashen, Changqing memorialized that garrison commander Chen Bangguang led militia at Luzai Port, recovered Zhanghua, and reported.',
    'On jiashen, Changqing reported Chen Bangguang\'s recovery of Zhanghua at Luzai Port.',
  ],
  s0083: [
    'On day dinghai, Wang Jie was made Associate Grand Secretary of the Eastern Pavilion and ordered to manage Rites affairs.',
    'On dinghai, Wang Jie became Eastern Pavilion associate grand secretary over rites.',
  ],
  s0084: [
    'Peng Yuanrui was transferred to be Minister of War; Ji Yun was made Minister of Rites.',
    'Peng Yuanrui took war; Ji Yun, rites.',
  ],
  s0085: [
    'On day gengyin, Minister of Revenue Cao Wenpei\'s request for retirement to care for parents was granted; Dong Gao was appointed to replace him.',
    'On gengyin, Cao Wenpei retired for filial care and Dong Gao took revenue.',
  ],
  s0086: [
    'On day xinmao, Song Jin was ordered to go to Kulun on business.',
    'On xinmao, Song Jin was sent to Kulun.',
  ],
  s0087: [
    'On day dingyou, Changqing was ordered to cross to Taiwan to suppress the bandits.',
    'On dingyou, Changqing was ordered across the strait to Taiwan.',
  ],
  s0088: [
    'Second month, day renyin: Lin Shuangwen again captured Fengshan, attacked Taiwan prefecture; Chai Daji directed troops and people in defense.',
    'In month 2, renyin, Lin Shuangwen retook Fengshan, besieged Taiwan city, and Chai Daji led the defense.',
  ],
  s0089: [
    'On day guimao, Li Shou was made Left Censor-in-Chief.',
    'On guimao, Li Shou became left censor-in-chief.',
  ],
  s0090: [
    'On day yisi, Changlin was made Shandong governor.',
    'On yisi, Changlin took Shandong.',
  ],
  s0091: [
    'On day renzi, this year\'s quota taxes were remitted for subordinate districts of Taiwan prefecture.',
    'On renzi, Taiwan lost this year\'s quota taxes.',
  ],
  s0092: [
    'On day bingchen, Zhuluo was recovered.',
    'On bingchen, Zhuluo was recovered.',
  ],
  s0093: [
    'On day jiazi, the Emperor went to the Eastern Tombs.',
    'On jiazi, Hongli worshipped at the Eastern Tombs.',
  ],
  s0094: [
    'On day dingmao, the Emperor paid rites at Zhao Western Tombs, Xiaoling, Xiao East Tombs, and Jing Tomb.',
    'On dingmao, Hongli worshipped at Zhao Western, Xiaoling, Xiao East, and Jing tombs.',
  ],
  s0095: [
    'Third month, day guiyou: the Emperor returned from the progress tour.',
    'In month 3, guiyou, Hongli returned from tour.',
  ],
  s0096: [
    'On day bingzi, because repair of the Ming tombs was completed, the Emperor went to inspect them and renewed the prohibition on fuel-gathering.',
    'On bingzi, Hongli inspected the restored Ming tombs and banned woodcutting.',
  ],
  s0097: [
    'On day xinsi, Fengshan was recovered.',
    'On xinsi, Fengshan was recovered.',
  ],
  s0098: [
    'On day xinmao, Jiang Sheng was made Hubei governor.',
    'On xinmao, Jiang Sheng took Hubei.',
  ],
  s0099: [
    'Huang Shijian was stripped of office for delaying and obstructing military affairs; his eldest grandson Jiamo was ordered to inherit the duke\'s title.',
    'Huang Shijian was stripped for military delay; Jiamo inherited the dukedom.',
  ],
  s0100: [
    'On day yiwei, Huang Shijian was arrested and imprisoned.',
    'On yiwei, Huang Shijian was jailed.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_015_b01.mjs <translation.json>'
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
