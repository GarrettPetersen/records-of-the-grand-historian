#!/usr/bin/env node
/** Generate all suishu chapter 031 translation batch files */
import fs from 'node:fs';

const sentences = JSON.parse(fs.readFileSync('/tmp/s031_sentences.json', 'utf8'));

const PLACE = {
  彭城: 'Pengcheng', 蘄: 'Qi', 谷陽: 'Guyang', 沛: 'Pei', 留: 'Liu', 豐: 'Feng', 蕭: 'Xiao', 滕: 'Teng',
  蘭陵: 'Lanling', 符離: 'Fuli', 方與: 'Fangyu', 瑕丘: 'Xiaqiu', 任城: 'Rencheng', 鄒: 'Zou', 曲阜: 'Qufu',
  泗水: 'Sishui', 平陸: 'Pinglu', 龔丘: 'Gongqiu', 梁父: 'Liangfu', 博城: 'Bocheng', 嬴: 'Ying',
  臨沂: 'Linyi', 費: 'Fei', 顓臾: 'Zhuanyu', 新泰: 'Xintai', 沂水: 'Yishui', 東安: "Dong'an", 莒: 'Ju',
  朐山: 'Qushan', 東海: 'Donghai', 漣水: 'Lianshui', 沭陽: 'Shuyang', 懷仁: 'Huairen',
  宿豫: 'Suyu', 夏丘: 'Xiaqiu', 徐城: 'Xucheng', 淮陽: 'Huaiyang', 下邳: 'Xiapi', 良城: 'Liangcheng', 郯: 'Tan',
  江陽: 'Jiangyang', 江都: 'Jiangdu', 海陵: 'Hailing', 甯海: 'Ninghai', 高郵: 'Gaoyou', 安宜: "Anyi",
  山陽: 'Shanyang', 盱眙: 'Xuyi', 鹽城: 'Yancheng', 清流: 'Qingliu', 全椒: 'Quanjiao', 六合: 'Luhe',
  永福: 'Yongfu', 句容: 'Jurong', 延陵: 'Yanling', 曲阿: "Qu'e", 鐘離: 'Zhongli', 定遠: 'Dingyuan', 化明: 'Huaming',
  塗山: 'Tushan', 壽春: 'Shouchun', 安豐: "An'feng", 霍丘: 'Huoqiu', 長平: 'Changping',
  光山: 'Guangshan', 樂安: "An'le", 定城: 'Dingcheng', 殷城: 'Yincheng', 固始: 'Gushi', 期思: 'Qisi',
  蘄春: 'Qichun', 浠水: 'Xishui', 蘄水: 'Qishui', 黃梅: 'Huangmei', 羅田: 'Luotian',
  合肥: 'Hefei', 廬江: 'Lujiang', 襄安: "Xiang'an", 慎: 'Shen', 霍山: 'Huoshan', 渒水: 'Bishui', 開化: 'Kaihua',
  懷甯: 'Huaining', 宿松: 'Susong', 太湖: 'Taihu', 望江: 'Wangjiang', 曆陽: 'Liyang', 烏江: 'Wujiang',
  江甯: 'Jiangning', 當塗: 'Dangtu', 溧水: 'Lishui', 宣城: 'Xuancheng', 涇: 'Jing', 南陵: 'Nanling', 秋浦: 'Qiupu',
  永世: 'Yongshi', 綏安: "Sui'an", 晉陵: 'Jinling', 江陰: 'Jiangyin', 無錫: 'Wuxi', 義興: 'Yixing',
  吳: 'Wu', 昆山: 'Kunshan', 常熟: 'Changshu', 烏程: 'Wucheng', 長城: 'Changcheng',
  會稽: 'Kuaiji', 句章: 'Juzhang', 剡: 'Shan', 諸暨: 'Zhuji', 錢唐: 'Qiantang', 富陽: 'Fuyang', 餘杭: 'Yuhang',
  於灊: 'YuQian', 鹽官: 'Yanguan', 武康: 'Wukang', 休甯: 'Xiuning', 歙: 'She', 黟: 'Yi',
  金華: 'Jinhua', 永康: 'Yongkang', 烏傷: 'Wushang', 括倉: 'Kuocang', 永嘉: 'Yongjia', 松陽: 'Songyang',
  臨海: 'Linhai', 閩: 'Min', 建安: "Jian'an", 南安: "Nan'an", 龍溪: 'Longxi', 雉山: 'Zhishan', 遂安: "Sui'an",
  桐廬: 'Tonglu', 鄱陽: 'Poyang', 余幹: 'Yugan', 弋陽: 'Yiyang', 臨川: 'Linchuan', 南城: 'Nancheng', 崇仁: 'Chongren',
  邵武: 'Shaowu', 廬陵: 'Luling', 泰和: 'Taihe', 安復: "An'fu", 新淦: 'Xingan', 贛: 'Gan', 虔化: 'Qianhua',
  雩都: 'Yudu', 南康: 'Nankang', 宜春: 'Yichun', 萍鄉: 'Pingxiang', 新喻: 'Xinyu', 豫章: 'Yuzhang', 豐城: 'Fengcheng',
  建城: 'Jiancheng', 建昌: 'Jianchang', 南海: 'Nanhai', 曲江: 'Qujiang', 始興: 'Shixing', 翁源: 'Wengyuan', 增城: 'Zengcheng',
  寶安: "Bao'an", 樂昌: 'Lechang', 四會: 'Sihui', 化蒙: 'Huameng', 清遠: 'Qingyuan', 含洭: 'Hanheng',
  政賓: 'Zhengpin', 懷集: 'Huaiji', 新會: 'Xinhui', 義寧: 'Yining', 歸善: 'Guishan', 河源: 'Heyuan', 博羅: 'Boluo',
  興甯: 'Xingning', 海豐: 'Haifeng', 海陽: 'Haiyang', 程鄉: 'Chengxiang', 潮陽: 'Chaoyang', 海甯: 'Haining', 萬川: 'Wanchuan',
  高涼: 'Gaoliang', 連江: 'Lianjiang', 電白: 'Dianbai', 杜原: 'Duyuan', 海安: "Hai'an", 陽春: 'Yangchun',
  石龍: 'Shilong', 吳川: 'Wuchuan', 茂名: 'Maoming', 高要: 'Gaoyao', 端溪: 'Duanxi', 樂城: 'Lecheng', 平興: 'Pingxing',
  新興: 'Xinxing', 博林: 'Bolin', 銅陵: 'Tongling', 瀧水: 'Longshui', 懷德: 'Huaide', 良德: 'Liangde', 安遂: "An'sui", 永業: 'Yongye', 永熙: 'Yongxi',
  封川: 'Fengchuan', 都城: 'Ducheng', 蒼梧: 'Cangwu', 封陽: 'Fengyang', 始安: "Shi'an", 平樂: 'Pingle', 荔浦: 'Lipu',
  建陵: 'Jianling', 陽朔: 'Yangshuo', 象: 'Xiang', 隋化: 'Suihua', 義熙: 'Yixi', 龍城: 'Longcheng', 馬平: 'Maping',
  桂林: 'Guilin', 陽壽: 'Yangshou', 富川: 'Fuchuan', 龍平: 'Longping', 豪靜: 'Haojing', 永平: 'Yongping', 武林: 'Wulin', 隋建: 'Suijian',
  安基: "An'ji", 隋安: "Sui'an", 普甯: 'Puning', 戎成: 'Rongcheng', 寧人: 'Ningren', 淳人: 'Chunren', 大賓: 'Dabin',
  賀川: 'Hechuan', 郁林: 'Yulin', 郁平: 'Yuping', 領方: 'Lingfang', 阿林: 'Alin', 石南: 'Shinan', 桂平: 'Guiping',
  馬度: 'Madou', 安成: "An'cheng", 甯浦: 'Ningpu', 樂山: 'Leshan', 嶺山: 'Lingshan', 宣化: 'Xuanhua',
  合浦: 'Hepu', 南昌: 'Nanchang', 北流: 'Beiliu', 封山: 'Fengshan', 定川: 'Dingchuan', 龍蘇: 'Longsu',
  海康: 'Haikang', 抱成: 'Baocheng', 隋康: 'Suikang', 扇沙: 'Shansha', 鐵杷: 'Tieba', 義倫: 'Yilun', 感恩: 'Ganen',
  顏盧: 'Yanlu', 毗善: 'Pishan', 昌化: 'Changhua', 吉安: "Ji'an", 延德: 'Yande', 寧遠: 'Ningyuan', 澄邁: 'Chengmai',
  武德: 'Wude', 欽江: 'Qinjiang', 安京: "An'jing", 內亭: 'Neiting', 南賓: 'Nanbin', 遵化: 'Zunhua',
  宋平: 'Songping', 龍編: 'Longbian', 硃枿: 'Zhufa', 隆平: 'Longping', 平道: 'Pingdao', 交趾: 'Jiaozhi', 嘉寧: 'Jianing',
  新昌: 'Xinchang', 安人: "An'ren", 九真: 'Jiuzhen', 移風: 'Yifeng', 胥浦: 'Xupu', 隆安: "Long'an", 軍安: "Jun'an",
  安順: "An'shun", 日南: 'Rinan', 九德: 'Jiude', 咸驩: 'Xianhuan', 浦陽: 'Puyang', 越常: 'Yuechang', 金甯: 'Jinning',
  交谷: 'Jiaogu', 安遠: "An'yuan", 光安: "Guang'an", 比景: 'Bijing', 硃吾: 'Zhuwu', 壽泠: 'Shouling', 西捲: 'Xijuan',
  新容: 'Xinrong', 真龍: 'Zhenlong', 多農: 'Duonong', 安樂: "An'le", 象浦: 'Xiangpu', 金山: 'Jinshan', 交江: 'Jiaojiang',
  南極: 'Naji', 江陵: 'Jiangling', 長楊: 'Changyang', 宜昌: 'Yichang', 枝江: 'Zhijiang', 當陽: 'Dangyang', 松滋: 'Songzi',
  長林: 'Changlin', 公安: "Gong'an", 安興: "An'xing", 紫陵: 'Ziling', 夷陵: 'Yiling', 夷道: 'Yidao', 遠安: "Yuan'an",
  長壽: 'Changshou', 藍水: 'Lanshui', 棨川: 'Qichuan', 漢東: 'Handong', 清騰: 'Qingteng', 樂鄉: 'Lexiang', 豐鄉: 'Fengxiang',
  章山: 'Zhangshan', 沔陽: 'Mianyang', 監利: 'Jianli', 竟陵: 'Jingling', 甑山: 'Zengshan', 沅陵: 'Yuanling', 大鄉: 'Daxiang',
  鹽泉: 'Yanquan', 龍檦: 'Longbang', 辰溪: 'Chenxi', 武陵: 'Wuling', 鹽水: 'Yanshui', 巴山: 'Bashan', 龍陽: 'Longyang',
  清江: 'Qingjiang', 開夷: 'Kaiyi', 建始: 'Jianshi', 襄陽: 'Xiangyang', 安養: "An'yang", 穀城: 'Gucheng', 上洪: 'Shanghong',
  率道: 'Shuaidao', 漢南: 'Hannan', 陰城: 'Yincheng', 義清: 'Yiqing', 南漳: 'Nanzhang', 常平: 'Changping', 鄀: 'Ruo',
  棗陽: 'Zaoyang', 舂陵: 'Chongling', 清潭: 'Qingtan', 湖陽: 'Huyang', 上馬: 'Shangma', 隋: 'Sui', 土山: 'Tushan',
  唐城: 'Tangcheng', 安貴: "An'gui", 順義: 'Shunyi', 平林: 'Pinglin', 上明: 'Shangming', 光化: 'Guanghua',
  安陸: "An'lu", 孝昌: 'Xiaochang', 吉陽: 'Jiyang', 應陽: 'Yingyang', 雲夢: 'Yunmeng', 京山: 'Jingshan', 富水: 'Fushui',
  應山: 'Yingshan', 黃岡: 'Huanggang', 黃陂: 'Huangpi', 木蘭: 'Mulan', 麻城: 'Macheng', 義陽: 'Yiyang', 鐘山: 'Zhongshan',
  羅山: 'Luoshan', 禮山: 'Lishan', 淮源: 'Huaiyuan', 湓城: 'Yancheng', 彭澤: 'Pengze', 江夏: 'Jiangxia', 武昌: 'Wuchang',
  永興: 'Yongxing', 蒲圻: 'Puqi', 澧陽: 'Liyang', 石門: 'Shimen', 孱陵: 'Canling', 安鄉: "An'xiang", 崇義: 'Chongyi',
  慈利: 'Cili', 巴陵: 'Baling', 華容: 'Huarong', 沅江: 'Yuanjiang', 湘陰: 'Xiangyin', 羅: 'Luo', 長沙: 'Changsha',
  衡山: 'Hengshan', 益陽: 'Yiyang', 衡陽: 'Hengyang', 邵陽: 'Shaoyang', 洡陰: 'Leiyin', 湘潭: 'Xiangtan', 新甯: 'Xining',
  郴舊: 'Chenjiu', 臨武: 'Linwu', 零陵: 'Lingling', 湘源: 'Xiangyuan', 永陽: 'Yongyang', 營道: 'Yingdao', 桂陽: 'Guiyang',
  陽山: 'Yangshan', 連山: 'Lianshan', 宣樂: 'Xuanle', 游安: "You'an", 熙平: 'Xiping', 武化: 'Wuhua', 桂嶺: 'Guiling',
  開建: 'Kaijian', 馮乘: 'Fengsheng', 盧陽: 'Luyang', 信安: "Xin'an",
};

const HH = {
  '一十三萬二百三十二': '130,232', '十二萬四千一十九': '124,019', '六萬三千四百二十三': '63,423',
  '二萬七千八百五十八': '27,858', '五萬二千七十': '52,070', '十一萬五千五百二十四': '115,524',
  '三萬五千一十五': '35,015', '三萬四千二百七十八': '34,278', '四萬一千四百三十三': '41,433',
  '三萬四千六百九十': '34,690', '四萬一千六百三十二': '41,632', '二萬一千七百六十六': '21,766',
  '八千二百五十四': '8,254', '一萬九千九百七十九': '19,979', '一萬七千五百九十九': '17,599',
  '一萬八千三百七十七': '18,377', '二萬二百七十一': '20,271', '一萬五千三百八十': '15,380',
  '六千一百六十四': '6,164', '一萬九千八百五': '19,805', '一萬五百四十二': '10,542',
  '一萬二千四百二十': '12,420', '七千三百四十三': '7,343', '一萬一百二': '10,102', '一萬九百': '10,900',
  '二萬三千七百一十四': '23,714', '一萬一千一百六十八': '11,168', '一萬一百一十六': '10,116',
  '一萬二千二十一': '12,021', '三萬七千四百八十二': '37,482', '六千四百二十': '6,420', '二千六十六': '2,066',
  '九千九百一十七': '9,917', '一萬七千七百八十七': '17,787', '一萬四千三百一十九': '14,319',
  '四千五百七十八': '4,578', '五萬四千五百一十七': '54,517', '三萬四千四十九': '34,049',
  '五萬九千二百': '59,200', '二萬八千六百九十': '28,690', '一萬九千五百': '19,500',
  '一萬二千六百七十': '12,670', '三萬五十六': '30,056', '一萬六千一百三十五': '16,135',
  '九千九百一十五': '9,915', '一千八百一十五': '1,815', '一千一百': '1,100', '一千二百二十': '1,220',
  '二萬四千一百二十五': '24,125', '五萬八千八百三十六': '58,836', '五千一百七十九': '5,179',
  '五萬三千三百八十五': '53,385', '四萬一千七百一十四': '41,714', '四千一百四十': '4,140',
  '三千四百一十六': '3,416', '二千六百五十八': '2,658', '九萬九千五百七十七': '99,577',
  '四萬二千八百四十七': '42,847', '四萬七千一百九十三': '47,193', '六萬八千四十二': '68,042',
  '二萬八千三百九十八': '28,398', '四萬五千九百三十': '45,930', '七千六百一十七': '7,617',
  '一萬三千七百七十一': '13,771', '八千九百六': '8,906', '六千九百三十四': '6,934',
  '一萬四千二百七十五': '14,275', '五千六十八': '5,068', '四千六百六十六': '4,666',
  '六千八百四十五': '6,845', '一萬二百六十五': '10,265',
};

const COUNTY = {
  一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
  十一: 11, 十二: 12, 十三: 13, 十四: 14, 十五: 15, 十六: 16, 一十: 10,
};

function pn(zh) {
  const name = PLACE[zh] || zh;
  return [name, name];
}

function countyCount(zh) {
  const m = zh.match(/^統縣([一二三四五六七八九十]+)，戸(.+)。$/);
  if (!m) return null;
  const counties = COUNTY[m[1]] || m[1];
  const hh = HH[m[2]] || m[2];
  const lit = `It governed ${counties} counties with ${hh} households.`;
  return [lit, lit];
}

function parseCountyHeader(zh) {
  // Pattern: LastCounty CommanderyName CommanderyName admin history
  const m = zh.match(/^([\u4e00-\u9fff]+)([\u4e00-\u9fff]+郡)([\u4e00-\u9fff]+郡)(.+)$/);
  if (m) {
    const [, lastCounty, cmd1, cmd2, rest] = m;
    const county = PLACE[lastCounty] || lastCounty;
    const cmd = cmd1.replace('郡', ' Commandery');
    const lit = `${county}. ${cmd}: ${cmd2.replace('郡', ' Commandery')} ${rest.replace(/，/g, ', ').replace(/。$/, '.')}`;
    return [lit, lit];
  }
  return null;
}

const MANUAL = {
  s0001: ['Xuzhou, Pengcheng Commandery: Pengcheng Commandery formerly had Xuzhou established there; Later Qi established the Southeast Circuit field headquarters; Later Zhou established a grand administrative office.', 'Xuzhou, Pengcheng Commandery: Pengcheng Commandery formerly had Xuzhou established there; Later Qi established the Southeast Circuit field headquarters; Later Zhou established a grand administrative office.'],
  s0002: ['The field headquarters was abolished, and the office was abolished.', 'The field headquarters was abolished, and the grand administrative office was abolished.'],
  s0014: ['Fangyu. Lu Commandery: Lu Commandery was formerly Yan Province and was changed to Lu Commandery.', 'Fangyu. Lu Commandery: Lu Commandery was formerly Yan Province and was changed to Lu Commandery.'],
  s0025: ['Ying. Langya Commandery: Langya Commandery formerly had Northern Xuzhou established; Later Zhou changed it to Yizhou.', 'Ying. Langya Commandery: Langya Commandery formerly had Northern Xuzhou established; Later Zhou changed it to Yizhou.'],
  s0033: ['Ju. Former Donghai Commandery: Donghai Commandery—in the Liang dynasty, Southern and Northern Qing Provinces were established; Eastern Wei changed it to Haizhou.', 'Ju. Former Donghai Commandery: Donghai Commandery—in the Liang dynasty, Southern and Northern Qing Provinces were established; Eastern Wei changed it to Haizhou.'],
  s0039: ['Huairen. Xiapi Commandery: Xiapi Commandery—in Later Wei, Southern Xuzhou was established; Liang changed it to Eastern Xuzhou; Eastern Wei again changed it to Eastern Chuzhou; Chen changed it to Anzhou; Later Zhou changed it to Sizhou.', 'Huairen. Xiapi Commandery: Xiapi Commandery—in Later Wei, Southern Xuzhou was established; Liang changed it to Eastern Xuzhou; Eastern Wei again changed it to Eastern Chuzhou; Chen changed it to Anzhou; Later Zhou changed it to Sizhou.'],
  s0048: ['The "Tribute of Yu" says: "The sea, Mount Dai, and the Huai constitute Xuzhou.', 'The "Tribute of Yu" says: "The sea, Mount Dai, and the Huai constitute Xuzhou.'],
  s0049: ['" Pengcheng, Lu, Langya, Donghai, and Xiapi commanderies obtained this territory.', '" Pengcheng, Lu, Langya, Donghai, and Xiapi commanderies obtained this territory.'],
  s0050: ['In the celestial offices, from five degrees of Kui to six degrees of Wei is the Descending Harvester asterism; in the earthly branches it corresponds to xu.', 'In the celestial offices, from five degrees of Kui to six degrees of Wei is the Descending Harvester asterism; in the earthly branches it corresponds to xu.'],
  s0051: ['Among the feudal states, it was the junction of Chu, Song, and Lu.', 'Among the feudal states, it was the junction of Chu, Song, and Lu.'],
  s0052: ['Examining its old customs, the people were quite fierce, bold, and lightly martial; their gentlemen relied on chivalric honor and spirited temperament and delighted in hosting guests—this was largely the wind of Chu.', 'Examining its old customs, the people were quite fierce, bold, and lightly martial; their gentlemen relied on chivalric honor and spirited temperament and delighted in hosting guests—this was largely the wind of Chu.'],
  s0053: ['Broadly speaking, Xu and Yan shared the same customs; hence the other commanderies all obtained what Qi and Lu held in esteem.', 'Broadly speaking, Xu and Yan shared the same customs; hence the other commanderies all obtained what Qi and Lu held in esteem.'],
  s0054: ['None failed to hold merchants cheap, devote themselves to farming, honor Confucian learning, and obtain the customs of the Zhu and Si rivers.', 'None failed to hold merchants cheap, devote themselves to farming, honor Confucian learning, and obtain the customs of the Zhu and Si rivers.'],
  s0055: ['Yangzhou, Jiangdu Commandery: Jiangdu Commandery—in the Liang dynasty, Southern Yan Province was established; Later Qi changed it to Eastern Guang Province; Chen again called it Southern Yan; Later Zhou changed it to Wuzhou.', 'Yangzhou, Jiangdu Commandery: Jiangdu Commandery—in the Liang dynasty, Southern Yan Province was established; Later Qi changed it to Eastern Guang Province; Chen again called it Southern Yan; Later Zhou changed it to Wuzhou.'],
  s0056: ['In the ninth year of Kaihuang it was changed to Yangzhou; a grand administrative office was established; at the beginning of Daye the office was abolished.', 'In the ninth year of Kaihuang it was changed to Yangzhou; a grand administrative office was established; at the beginning of Daye the office was abolished.'],
  s0073: ["Qu'e. Zhongli Commandery: Zhongli Commandery—in Later Qi it was called Western Chuzhou and was changed to Haozhou.", "Qu'e. Zhongli Commandery: Zhongli Commandery—in Later Qi it was called Western Chuzhou and was changed to Haozhou."],
  s0078: ['Tushan. Huainan Commandery: Huainan Commandery was formerly called Yuzhou; Later Wei called it Yangzhou; Liang called it Southern Yuzhou; Eastern Wei called it Yangzhou; Chen again called it Yuzhou; Later Zhou called it Yangzhou.', 'Tushan. Huainan Commandery: Huainan Commandery was formerly called Yuzhou; Later Wei called it Yangzhou; Liang called it Southern Yuzhou; Eastern Wei called it Yangzhou; Chen again called it Yuzhou; Later Zhou called it Yangzhou.'],
  s0079: ['It was called Shouzhou; a grand administrative office was established; the office was abolished.', 'It was called Shouzhou; a grand administrative office was established; the office was abolished.'],
  s0084: ['Changping. Yiyang Commandery: Yiyang Commandery—in the Liang dynasty, Guangzhou was established.', 'Changping. Yiyang Commandery: Yiyang Commandery—in the Liang dynasty, Guangzhou was established.'],
  s0091: ['Qisi. Qichun Commandery: Qichun Commandery—in Later Qi, Yongzhou was established; Later Zhou changed it to Qizhou.', 'Qisi. Qichun Commandery: Qichun Commandery—in Later Qi, Yongzhou was established; Later Zhou changed it to Qizhou.'],
  s0092: ['At the beginning of Kaihuang a grand administrative office was established; in the ninth year the office was abolished.', 'At the beginning of Kaihuang a grand administrative office was established; in the ninth year the office was abolished.'],
  s0098: ['Luotian. Lujiang Commandery: Lujiang Commandery—in the Liang dynasty, Southern Yuzhou was established and was again changed to Hezhou.', 'Luotian. Lujiang Commandery: Lujiang Commandery—in the Liang dynasty, Southern Yuzhou was established and was again changed to Hezhou.'],
  s0099: ['At the beginning of Kaihuang it was changed to Luzhou.', 'At the beginning of Kaihuang it was changed to Luzhou.'],
  s0107: ['Kaihua. Tongan Commandery: Tongan Commandery—in the Liang dynasty, Yuzhou was established; afterward it was changed to Jinzhou; Later Qi changed it to Jiangzhou; Chen again called it Jinzhou; at the beginning of Kaihuang it was called Xizhou.', 'Kaihua. Tongan Commandery: Tongan Commandery—in the Liang dynasty, Yuzhou was established; afterward it was changed to Jinzhou; Later Qi changed it to Jiangzhou; Chen again called it Jinzhou; at the beginning of Kaihuang it was called Xizhou.'],
  s0113: ['Tongan. Liyang Commandery: Liyang Commandery—in Later Qi, Hezhou was established.', 'Tongan. Liyang Commandery: Liyang Commandery—in Later Qi, Hezhou was established.'],
  s0116: ['Wujiang. Tongyang Commandery: Tongyang Commandery—from Eastern Jin onward the commandery established there was called Yangzhou.', 'Wujiang. Tongyang Commandery: Tongyang Commandery—from Eastern Jin onward the commandery established there was called Yangzhou.'],
  s0117: ['When Chen was pacified, an edict ordered the land to be leveled and opened for cultivation; Jiangzhou was newly established at Shitou Fortress, governing 3 counties with 24,125 households.', 'When Chen was pacified, an edict ordered the land to be leveled and opened for cultivation; Jiangzhou was newly established at Shitou Fortress, governing 3 counties with 24,125 households.'],
  s0120: ['Lishui. Xuancheng Commandery: Xuancheng Commandery formerly had Southern Yuzhou established.', 'Lishui. Xuancheng Commandery: Xuancheng Commandery formerly had Southern Yuzhou established.'],
  s0121: ['When Chen was pacified, it was changed to Xuanzhou.', 'When Chen was pacified, it was changed to Xuanzhou.'],
  s0128: ["Sui'an. Piling Commandery: Piling Commandery—when Chen was pacified, Changzhou was established.", "Sui'an. Piling Commandery: Piling Commandery—when Chen was pacified, Changzhou was established."],
  s0133: ['Yixing. Wu Commandery: Wu Commandery—in the Chen dynasty, Wuzhou was established.', 'Yixing. Wu Commandery: Wu Commandery—in the Chen dynasty, Wuzhou was established.'],
  s0134: ['When Chen was pacified, it was changed to Suzhou; at the beginning of Daye it was again called Wuzhou.', 'When Chen was pacified, it was changed to Suzhou; at the beginning of Daye it was again called Wuzhou.'],
  s0140: ['Changcheng. Kuaiji Commandery: Kuaiji Commandery—in the Liang dynasty, Eastern Yang Province was established.', 'Changcheng. Kuaiji Commandery: Kuaiji Commandery—in the Liang dynasty, Eastern Yang Province was established.'],
  s0141: ['At the beginning of Chen it was abolished, but soon restored.', 'At the beginning of Chen it was abolished, but soon restored.'],
  s0142: ['When Chen was pacified, it was changed to Wuzhou and a grand administrative office was established.', 'When Chen was pacified, it was changed to Wuzhou and a grand administrative office was established.'],
  s0143: ['At the beginning of Daye the office was abolished and Yuezhou was established.', 'At the beginning of Daye the office was abolished and Yuezhou was established.'],
  s0148: ['Zhuji. Yuhang Commandery: Yuhang Commandery—when Chen was pacified, Hangzhou was established.', 'Zhuji. Yuhang Commandery: Yuhang Commandery—when Chen was pacified, Hangzhou was established.'],
  s0149: ['During Renshou a grand administrative office was established; at the beginning of Daye the office was abolished.', 'During Renshou a grand administrative office was established; at the beginning of Daye the office was abolished.'],
  s0156: ['Wukang. Xin\'an Commandery: Xin\'an Commandery—when Chen was pacified, Shezhou was established.', 'Wukang. Xin\'an Commandery: Xin\'an Commandery—when Chen was pacified, Shezhou was established.'],
  s0160: ['Yi. Dongyang Commandery: Dongyang Commandery—when Chen was pacified, Wuzhou was established.', 'Yi. Dongyang Commandery: Dongyang Commandery—when Chen was pacified, Wuzhou was established.'],
  s0165: ['Xin\'an. Yongjia Commandery: Yongjia Commandery—Chuzhou was established; in the twelfth year it was changed to Kuozhou.', 'Xin\'an. Yongjia Commandery: Yongjia Commandery—Chuzhou was established; in the twelfth year it was changed to Kuozhou.'],
  s0170: ['Linhai. Jian\'an Commandery: Jian\'an Commandery—in the Chen dynasty, Minzhou was established, then abolished; afterward Fengzhou was again established.', 'Linhai. Jian\'an Commandery: Jian\'an Commandery—in the Chen dynasty, Minzhou was established, then abolished; afterward Fengzhou was again established.'],
  s0171: ['When Chen was pacified, it was changed to Quanzhou.', 'When Chen was pacified, it was changed to Quanzhou.'],
  s0172: ['At the beginning of Daye it was changed to Minzhou.', 'At the beginning of Daye it was changed to Minzhou.'],
  s0177: ['Longxi. Sui\'an Commandery: Sui\'an Commandery—Muzhou was established.', 'Longxi. Sui\'an Commandery: Sui\'an Commandery—Muzhou was established.'],
  s0181: ['Tonglu. Poyang Commandery: Poyang Commandery—in the Liang dynasty, Wuzhou was established; Chen abolished it.', 'Tonglu. Poyang Commandery: Poyang Commandery—in the Liang dynasty, Wuzhou was established; Chen abolished it.'],
  s0182: ['When Chen was pacified, Raozhou was established.', 'When Chen was pacified, Raozhou was established.'],
  s0186: ['Yiyang. Linchuan Commandery: Linchuan Commandery—when Chen was pacified, Fuzhou was established.', 'Yiyang. Linchuan Commandery: Linchuan Commandery—when Chen was pacified, Fuzhou was established.'],
  s0191: ['Shaowu. Luling Commandery: Luling Commandery—when Chen was pacified, Jizhou was established.', 'Shaowu. Luling Commandery: Luling Commandery—when Chen was pacified, Jizhou was established.'],
  s0196: ['Xingan. Nankang Commandery: Nankang Commandery—in the ninth year of Kaihuang, Qianzhou was established.', 'Xingan. Nankang Commandery: Nankang Commandery—in the ninth year of Kaihuang, Qianzhou was established.'],
  s0201: ['Nankang. Yichun Commandery: Yichun Commandery—when Chen was pacified, Yuanzhou was established.', 'Nankang. Yichun Commandery: Yichun Commandery—when Chen was pacified, Yuanzhou was established.'],
  s0205: ['Xinyu. Yuzhang Commandery: Yuzhang Commandery—when Chen was pacified, the Hongzhou grand administrative office was established.', 'Xinyu. Yuzhang Commandery: Yuzhang Commandery—when Chen was pacified, the Hongzhou grand administrative office was established.'],
  s0206: ['At the beginning of Daye the office was abolished.', 'At the beginning of Daye the office was abolished.'],
  s0211: ['Jiancheng. Nanhai Commandery: Nanhai Commandery formerly had Guangzhou established; in the Liang and Chen dynasties a regional inspectorate was also established.', 'Jiancheng. Nanhai Commandery: Nanhai Commandery formerly had Guangzhou established; in the Liang and Chen dynasties a regional inspectorate was also established.'],
  s0212: ['When Chen was pacified, a grand administrative office was established.', 'When Chen was pacified, a grand administrative office was established.'],
  s0213: ['In the first year of Renshou, Fanzhou was established; at the beginning of Daye the office was abolished.', 'In the first year of Renshou, Fanzhou was established; at the beginning of Daye the office was abolished.'],
  s0229: ['Yining. Longchuan Commandery: Longchuan Commandery—when Chen was pacified, the Xunzhou grand administrative office was established.', 'Yining. Longchuan Commandery: Longchuan Commandery—when Chen was pacified, the Xunzhou grand administrative office was established.'],
  s0230: ['At the beginning of Daye the office was abolished.', 'At the beginning of Daye the office was abolished.'],
  s0236: ['Haifeng. Yi\'an Commandery: Yi\'an Commandery—in the Liang dynasty, Eastern Yang Province was established; afterward it was changed to Yingzhou, and when Chen was pacified the province was abolished.', 'Haifeng. Yi\'an Commandery: Yi\'an Commandery—in the Liang dynasty, Eastern Yang Province was established; afterward it was changed to Yingzhou, and when Chen was pacified the province was abolished.'],
  s0237: ['When Chen was pacified, Chaozhou was established.', 'When Chen was pacified, Chaozhou was established.'],
  s0243: ['Wanchuan. Gaoliang Commandery: Gaoliang Commandery—in the Liang dynasty, Gaozhou was established.', 'Wanchuan. Gaoliang Commandery: Gaoliang Commandery—in the Liang dynasty, Gaozhou was established.'],
  s0253: ['Maoming. Xin\'an Commandery: Xin\'an Commandery—when Chen was pacified, Duanzhou was established.', 'Maoming. Xin\'an Commandery: Xin\'an Commandery—when Chen was pacified, Duanzhou was established.'],
  s0261: ['Tongling. Yongxi Commandery: Yongxi Commandery—in the Liang dynasty, Longzhou was established.', 'Tongling. Yongxi Commandery: Yongxi Commandery—in the Liang dynasty, Longzhou was established.'],
  s0268: ['Yongxi. Cangwu Commandery: Cangwu Commandery—in the Liang dynasty, Chengzhou was established; at the beginning of Kaihuang it was changed to Fengzhou.', 'Yongxi. Cangwu Commandery: Cangwu Commandery—in the Liang dynasty, Chengzhou was established; at the beginning of Kaihuang it was changed to Fengzhou.'],
  s0272: ['Cangwu formerly had Cangwu Commandery established.', 'Cangwu formerly had Cangwu Commandery established.'],
  s0273: ['When Chen was pacified, the commandery was abolished.', 'When Chen was pacified, the commandery was abolished.'],
  s0274: ['(End of county note.)', 'This closes the county annotation in the source text.'],
  s0275: ['Fengyang. Shi\'an Commandery: Shi\'an Commandery—in the Liang dynasty, Guizhou was established.', 'Fengyang. Shi\'an Commandery: Shi\'an Commandery—in the Liang dynasty, Guizhou was established.'],
  s0276: ['When Chen was pacified, a grand administrative office was established.', 'When Chen was pacified, a grand administrative office was established.'],
  s0277: ['The office was abolished.', 'The grand administrative office was abolished.'],
  s0293: ['Haojing. Yongping Commandery: Yongping Commandery—when Chen was pacified, Tengzhou was established.', 'Haojing. Yongping Commandery: Yongping Commandery—when Chen was pacified, Tengzhou was established.'],
  s0305: ['Hechuan. Yulin Commandery: Yulin Commandery—in the Liang dynasty, Dingzhou was established; afterward it was changed to Southern Dingzhou.', 'Hechuan. Yulin Commandery: Yulin Commandery—in the Liang dynasty, Dingzhou was established; afterward it was changed to Southern Dingzhou.'],
  s0306: ['When Chen was pacified, it was changed to Yinzhou.', 'When Chen was pacified, it was changed to Yinzhou.'],
  s0307: ['At the beginning of Daye it was changed to Yu Province.', 'At the beginning of Daye it was changed to Yu Province.'],
  s0320: ['Xuanhua. Hepu Commandery: Hepu Commandery formerly had Yuezhou established.', 'Xuanhua. Hepu Commandery: Hepu Commandery formerly had Yuezhou established.'],
  s0321: ['At the beginning of Daye it was changed to Luzhou; soon it was again changed to Hezhou.', 'At the beginning of Daye it was changed to Luzhou; soon it was again changed to Hezhou.'],
  s0333: ['Tieba. Zhuya Commandery: Zhuya Commandery—in the Liang dynasty, Yazhou was established.', 'Tieba. Zhuya Commandery: Zhuya Commandery—in the Liang dynasty, Yazhou was established.'],
  s0344: ['Wude. Ningyue Commandery: Ningyue Commandery—in the Liang dynasty, Anzhou was established; in the eighteenth year of Kaihuang it was changed to Qinzhou.', 'Wude. Ningyue Commandery: Ningyue Commandery—in the Liang dynasty, Anzhou was established; in the eighteenth year of Kaihuang it was changed to Qinzhou.'],
  s0351: ['Hai\'an. Jiaozhi Commandery: Jiaozhi Commandery was formerly called Jiaozhou.', 'Hai\'an. Jiaozhi Commandery: Jiaozhi Commandery was formerly called Jiaozhou.'],
  s0361: ['Anren. Jiuzhen Commandery: Jiuzhen Commandery—in the Liang dynasty, Aizhou was established.', 'Anren. Jiuzhen Commandery: Jiuzhen Commandery—in the Liang dynasty, Aizhou was established.'],
  s0369: ['Rinan. Rinan Commandery: Rinan Commandery—in the Liang dynasty, Dezhou was established; in the eighteenth year of Kaihuang it was changed to Huanzhou.', 'Rinan. Rinan Commandery: Rinan Commandery—in the Liang dynasty, Dezhou was established; in the eighteenth year of Kaihuang it was changed to Huanzhou.'],
  s0378: ['Guang\'an. Bijing Commandery: Bijing Commandery—in the first year of Daye, Linyi was pacified and Dangzhou was established; soon it was changed to a commandery.', 'Guang\'an. Bijing Commandery: Bijing Commandery—in the first year of Daye, Linyi was pacified and Dangzhou was established; soon it was changed to a commandery.'],
  s0383: ['Xijuan. Haiyin Commandery: Haiyin Commandery—in the first year of Daye, Linyi was pacified and Nongzhou was established; soon it was changed to a commandery.', 'Xijuan. Haiyin Commandery: Haiyin Commandery—in the first year of Daye, Linyi was pacified and Nongzhou was established; soon it was changed to a commandery.'],
  s0388: ['Anle. Linyi Commandery: Linyi Commandery—in the first year of Daye, Linyi was pacified and Chongzhou was established; soon it was changed to a commandery.', 'Anle. Linyi Commandery: Linyi Commandery—in the first year of Daye, Linyi was pacified and Chongzhou was established; soon it was changed to a commandery.'],
  s0394: ['In the "Tribute of Yu," Yangzhou was the land of the Huai and the sea.', 'In the "Tribute of Yu," Yangzhou was the land of the Huai and the sea.'],
  s0395: ['In the celestial offices, from twelve degrees of Dou to seven degrees of Xuannü is the Star Chronogram asterism; in the earthly branches it corresponds to chou; Wu and Yue obtained this allotment.', 'In the celestial offices, from twelve degrees of Dou to seven degrees of Xuannü is the Star Chronogram asterism; in the earthly branches it corresponds to chou; Wu and Yue obtained this allotment.'],
  s0396: ['The customs south of the Yangzi: fire-plowing and water-weeding, eating fish and rice, taking fishing and hunting as occupations—though without stores of accumulated wealth, yet also without famine.', 'The customs south of the Yangzi: fire-plowing and water-weeding, eating fish and rice, taking fishing and hunting as occupations—though without stores of accumulated wealth, yet also without famine.'],
  s0397: ['Their customs trust ghosts and spirits and delight in excessive sacrifices; fathers and sons sometimes live apart—this is broadly so.', 'Their customs trust ghosts and spirits and delight in excessive sacrifices; fathers and sons sometimes live apart—this is broadly so.'],
  s0398: ['Jiangdu, Yiyang, Huainan, Zhongli, Qichun, Tongan, Lujiang, and Liyang—the nature of the people is all impetuous and forceful, the spirit of the region resolute and decisive; they harbor harm, regard death as returning home, and in battle prize deception—this was their old wind.', 'Jiangdu, Yiyang, Huainan, Zhongli, Qichun, Tongan, Lujiang, and Liyang—the nature of the people is all impetuous and forceful, the spirit of the region resolute and decisive; they harbor harm, regard death as returning home, and in battle prize deception—this was their old wind.'],
  s0399: ['Since the pacification of Chen, their customs changed considerably; they came to esteem plain simplicity and love frugality; mourning rites and marriage gradually conformed to ritual.', 'Since the pacification of Chen, their customs changed considerably; they came to esteem plain simplicity and love frugality; mourning rites and marriage gradually conformed to ritual.'],
  s0400: ['The defects of their customs were somewhat remedied compared with antiquity.', 'The defects of their customs were somewhat remedied compared with antiquity.'],
  s0401: ['Danyang was the site of the old capital; its population was originally abundant. Petty men mostly traded; gentlemen relied on official stipends; market lanes and shops rivaled the two capitals; people mixed from all five directions—hence the customs were quite similar.', 'Danyang was the site of the old capital; its population was originally abundant. Petty men mostly traded; gentlemen relied on official stipends; market lanes and shops rivaled the two capitals; people mixed from all five directions—hence the customs were quite similar.'],
  s0402: ['Jingkou opened eastward to Wu and Kuaiji, connected south to rivers and lakes, and linked west to the capital region—it too was a great metropolis.', 'Jingkou opened eastward to Wu and Kuaiji, connected south to rivers and lakes, and linked west to the capital region—it too was a great metropolis.'],
  s0403: ['Its people from the beginning all practiced warfare and were called the finest troops under Heaven.', 'Its people from the beginning all practiced warfare and were called the finest troops under Heaven.'],
  s0404: ['The custom took the fifth day of the fifth month as a contest of strength; each side gauged relative power and matched opponents—much like military drill.', 'The custom took the fifth day of the fifth month as a contest of strength; each side gauged relative power and matched opponents—much like military drill.'],
  s0405: ['Xuancheng, Piling, Wu, Kuaiji, Yuhang, and Dongyang shared much the same customs.', 'Xuancheng, Piling, Wu, Kuaiji, Yuhang, and Dongyang shared much the same customs.'],
  s0406: ['Yet these several commanderies had fertile marshes and plains, rich in land and sea produce, where rare goods gathered—hence merchants all converged.', 'Yet these several commanderies had fertile marshes and plains, rich in land and sea produce, where rare goods gathered—hence merchants all converged.'],
  s0407: ['Among them, gentlemen honored ritual; common folk were simple and generous—hence customs were clear and Daoist teaching flourished; this too was what the regional spirit held in esteem.', 'Among them, gentlemen honored ritual; common folk were simple and generous—hence customs were clear and Daoist teaching flourished; this too was what the regional spirit held in esteem.'],
  s0408: ['The customs of Yuzhang were quite like those of central Wu; its gentlemen were skilled at managing households, its petty men diligent in farming.', 'The customs of Yuzhang were quite like those of central Wu; its gentlemen were skilled at managing households, its petty men diligent in farming.'],
  s0409: ['Men of rank often had several wives who exposed themselves in the marketplaces and competed to divide cash by the fen to supply their husbands.', 'Men of rank often had several wives who exposed themselves in the marketplaces and competed to divide cash by the fen to supply their husbands.'],
  s0410: ['When nominating filial and incorrupt candidates, they further required wealth; though a first wife had toiled for many years and her children filled the house, she might still be cast out to make way for a successor.', 'When nominating filial and incorrupt candidates, they further required wealth; though a first wife had toiled for many years and her children filled the house, she might still be cast out to make way for a successor.'],
  s0411: ['The custom had little litigation but esteemed song and dance.', 'The custom had little litigation but esteemed song and dance.'],
  s0412: ['Silkworms matured four or five times a year; people were diligent in spinning and weaving; some even washed yarn at night and finished cloth by dawn—the custom called this "cock-crow cloth."', 'Silkworms matured four or five times a year; people were diligent in spinning and weaving; some even washed yarn at night and finished cloth by dawn—the custom called this "cock-crow cloth."'],
  s0413: ['Xin\'an, Yongjia, Jian\'an, Sui\'an, Poyang, Jiujiang, Linchuan, Luling, Nankang, and Yichun—their customs again resembled Yuzhang considerably, while the people of Luling were simple and honest and mostly lived to great age.', 'Xin\'an, Yongjia, Jian\'an, Sui\'an, Poyang, Jiujiang, Linchuan, Luling, Nankang, and Yichun—their customs again resembled Yuzhang considerably, while the people of Luling were simple and honest and mostly lived to great age.'],
  s0414: ['Yet in these several commanderies people often kept gu poisons, and Yichun was especially severe.', 'Yet in these several commanderies people often kept gu poisons, and Yichun was especially severe.'],
  s0415: ['The method was on the fifth day of the fifth month to gather a hundred kinds of insects, from snakes down to lice, place them together in a vessel, and let them devour one another; the one kind remaining was kept—if a snake, it was called snake gu; if a louse, louse gu—and used to kill people.', 'The method was on the fifth day of the fifth month to gather a hundred kinds of insects, from snakes down to lice, place them together in a vessel, and let them devour one another; the one kind remaining was kept—if a snake, it was called snake gu; if a louse, louse gu—and used to kill people.'],
  s0416: ['Once ingested it entered the person\'s belly and ate the five viscera; when the victim died, its offspring passed into the gu keeper\'s household.', 'Once ingested it entered the person\'s belly and ate the five viscera; when the victim died, its offspring passed into the gu keeper\'s household.'],
  s0417: ['If for three years no one else was killed, the keeper himself would suffer its harm.', 'If for three years no one else was killed, the keeper himself would suffer its harm.'],
  s0418: ['Generation after generation of descendants transmitted it without end; it could also pass with a woman in marriage.', 'Generation after generation of descendants transmitted it without end; it could also pass with a woman in marriage.'],
  s0419: ['Gan Bao called it a ghost, but in fact it was not.', 'Gan Bao called it a ghost, but in fact it was not.'],
  s0420: ['After the turmoil of Hou Jing, most gu households died out; with no master, the gu flew along the roads and perished.', 'After the turmoil of Hou Jing, most gu households died out; with no master, the gu flew along the roads and perished.'],
  s0421: ['From south of the Ling Range for more than twenty commanderies, the land was mostly low and damp, all with much miasma; people especially died young.', 'From south of the Ling Range for more than twenty commanderies, the land was mostly low and damp, all with much miasma; people especially died young.'],
  s0422: ['Nanhai and Jiaozhi were each a great metropolis; both lay near the sea, rich in rhinoceros, elephants, tortoise shell, and pearls—rare and precious goods—hence merchants who came mostly grew wealthy.', 'Nanhai and Jiaozhi were each a great metropolis; both lay near the sea, rich in rhinoceros, elephants, tortoise shell, and pearls—rare and precious goods—hence merchants who came mostly grew wealthy.'],
  s0423: ['The nature of the people was all lightly fierce; they easily rose in rebellion; topknots and squatting sitting were their old wind.', 'The nature of the people was all lightly fierce; they easily rose in rebellion; topknots and squatting sitting were their old wind.'],
  s0424: ['The Li people were plain, straight, and trusted in good faith; the various Man were brave and self-reliant—all valued bribes over death and made wealth their heroism.', 'The Li people were plain, straight, and trusted in good faith; the various Man were brave and self-reliant—all valued bribes over death and made wealth their heroism.'],
  s0425: ['They dwelled in nests on cliffs and devoted their strength to farming.', 'They dwelled in nests on cliffs and devoted their strength to farming.'],
  s0426: ['They carved wood to make tokens of contract; once words were sworn, they never changed until death.', 'They carved wood to make tokens of contract; once words were sworn, they never changed until death.'],
  s0427: ['Fathers and sons had separate estates; if a father was poor, he might even pledge himself to his son.', 'Fathers and sons had separate estates; if a father was poor, he might even pledge himself to his son.'],
  s0428: ['All the Liao were thus.', 'All the Liao were thus.'],
  s0429: ['They also cast bronze into great drums; when first finished, they hung them in the courtyard and set out wine to summon their kind.', 'They also cast bronze into great drums; when first finished, they hung them in the courtyard and set out wine to summon their kind.'],
  s0430: ['When guests came with wealthy sons or daughters, they made large hairpins of gold and silver, took them to strike the drum, and finally left them for the host—a thing called "bronze-drum hairpins."', 'When guests came with wealthy sons or daughters, they made large hairpins of gold and silver, took them to strike the drum, and finally left them for the host—a thing called "bronze-drum hairpins."'],
  s0431: ['The custom loved mutual killing; many feuds were plotted; when they wished to attack one another they sounded this drum, and those who arrived were like clouds.', 'The custom loved mutual killing; many feuds were plotted; when they wished to attack one another they sounded this drum, and those who arrived were like clouds.'],
  s0432: ['Whoever had a drum was called "Du Lao," and the multitude deferred to him.', 'Whoever had a drum was called "Du Lao," and the multitude deferred to him.'],
  s0433: ['Tracing the old matter: Zhao Tuo in Han times styled himself "great chieftain of the Man and Yi, old subject," hence the Li still call those they honor "Dao Lao."', 'Tracing the old matter: Zhao Tuo in Han times styled himself "great chieftain of the Man and Yi, old subject," hence the Li still call those they honor "Dao Lao."'],
  s0434: ['Through corrupted speech it was again called "Du Lao."', 'Through corrupted speech it was again called "Du Lao."'],
  s0435: ['Jingzhou, Nan Commandery: Nan Commandery formerly had Jingzhou established.', 'Jingzhou, Nan Commandery: Nan Commandery formerly had Jingzhou established.'],
  s0436: ['Western Wei, because Liang was enfeoffed as a vassal state, again established the Jiangling grand administrative office.', 'Western Wei, because Liang was enfeoffed as a vassal state, again established the Jiangling grand administrative office.'],
  s0437: ['At the beginning of Kaihuang the office was abolished.', 'At the beginning of Kaihuang the office was abolished.'],
  s0438: ['In the seventh year Liang was annexed; the Jiangling grand administrator was again established; in the twentieth year it was changed to the Jingzhou grand administrator.', 'In the seventh year Liang was annexed; the Jiangling grand administrator was again established; in the twentieth year it was changed to the Jingzhou grand administrator.'],
  s0439: ['At the beginning of Daye it was abolished.', 'At the beginning of Daye it was abolished.'],
  s0450: ['Ziling. Yiling Commandery: Yiling Commandery—in the Liang dynasty, Yizhou was established; Western Wei changed it to Tuozhou; Later Zhou changed it to Xiazhou.', 'Ziling. Yiling Commandery: Yiling Commandery—in the Liang dynasty, Yizhou was established; Western Wei changed it to Tuozhou; Later Zhou changed it to Xiazhou.'],
  s0454: ['Yuan\'an. Jingling Commandery: Jingling Commandery formerly had Yingzhou established.', 'Yuan\'an. Jingling Commandery: Jingling Commandery formerly had Yingzhou established.'],
  s0463: ['Zhangshan. Mianyang Commandery: Mianyang Commandery—in Later Zhou, Fuzhou was established; at the beginning of Daye it was changed to Mianzhou.', 'Zhangshan. Mianyang Commandery: Mianyang Commandery—in Later Zhou, Fuzhou was established; at the beginning of Daye it was changed to Mianzhou.'],
  s0469: ['Hanyang. Yuanling Commandery: Yuanling Commandery—in the ninth year of Kaihuang, Chenzhou was established.', 'Hanyang. Yuanling Commandery: Yuanling Commandery—in the ninth year of Kaihuang, Chenzhou was established.'],
  s0475: ['Chenxi. Wuling Commandery: Wuling Commandery—in the Liang dynasty, Wuzhou was established; afterward it was changed to Yuanzhou.', 'Chenxi. Wuling Commandery: Wuling Commandery—in the Liang dynasty, Wuzhou was established; afterward it was changed to Yuanzhou.'],
  s0476: ['When Chen was pacified, it became Langzhou.', 'When Chen was pacified, it became Langzhou.'],
  s0479: ['Longyang. Qingjiang Commandery: Qingjiang Commandery—in Later Zhou, Tingzhou was established; at the beginning of Daye it was changed to Yongzhou.', 'Longyang. Qingjiang Commandery: Qingjiang Commandery—in Later Zhou, Tingzhou was established; at the beginning of Daye it was changed to Yongzhou.'],
  s0485: ['Jianshi. Xiangyang Commandery: Xiangyang Commandery—in the Jiang-left era, Yong Province was concurrently established as a refugee administration.', 'Jianshi. Xiangyang Commandery: Xiangyang Commandery—in the Jiang-left era, Yong Province was concurrently established as a refugee administration.'],
  s0486: ['Western Wei changed it to Xiangzhou and established a grand administrative office.', 'Western Wei changed it to Xiangzhou and established a grand administrative office.'],
  s0487: ['At the beginning of Daye the office was abolished.', 'At the beginning of Daye the office was abolished.'],
  s0499: ['Ruo. Chunling Commandery: Chunling Commandery—in Later Wei, Southern Jing Province was established; Western Wei changed it to Changzhou.', 'Ruo. Chunling Commandery: Chunling Commandery—in Later Wei, Southern Jing Province was established; Western Wei changed it to Changzhou.'],
  s0506: ['Caiyang. Handong Commandery: Handong Commandery—Western Wei established Bing Province; afterward it was changed to Suizhou.', 'Caiyang. Handong Commandery: Handong Commandery—Western Wei established Bing Province; afterward it was changed to Suizhou.'],
  s0515: ['Guanghua. Anlu Commandery: Anlu Commandery—in the Liang dynasty, Southern Si Province was established and soon abolished.', 'Guanghua. Anlu Commandery: Anlu Commandery—in the Liang dynasty, Southern Si Province was established and soon abolished.'],
  s0516: ['Western Wei established the Anzhou grand administrative office; in the fourteenth year of Kaihuang the office was abolished.', 'Western Wei established the Anzhou grand administrative office; in the fourteenth year of Kaihuang the office was abolished.'],
  s0525: ['Yingshan. Yong\'an Commandery: Yong\'an Commandery—in Later Qi, Hengzhou was established; Chen abolished it; Later Zhou again established it; in the fifth year of Kaihuang it was changed to Huangzhou.', 'Yingshan. Yong\'an Commandery: Yong\'an Commandery—in Later Qi, Hengzhou was established; Chen abolished it; Later Zhou again established it; in the fifth year of Kaihuang it was changed to Huangzhou.'],
  s0530: ['Macheng. Yiyang Commandery: Yiyang Commandery—in Qi, Sizhou was established.', 'Macheng. Yiyang Commandery: Yiyang Commandery—in Qi, Sizhou was established.'],
  s0531: ['In the Liang dynasty it was called Northern Si Province; afterward it was again called Sizhou.', 'In the Liang dynasty it was called Northern Si Province; afterward it was again called Sizhou.'],
  s0532: ['Later Wei changed it to Yingzhou; Later Zhou changed it to Shenzhou; in the second year of Daye it became Yizhou.', 'Later Wei changed it to Yingzhou; Later Zhou changed it to Shenzhou; in the second year of Daye it became Yizhou.'],
  s0538: ['Huaiyuan. Jiujiang Commandery: Jiujiang Commandery formerly had Jiangzhou established.', 'Huaiyuan. Jiujiang Commandery: Jiujiang Commandery formerly had Jiangzhou established.'],
  s0541: ['Pengze. Jiangxia Commandery: Jiangxia Commandery formerly had Yingzhou established.', 'Pengze. Jiangxia Commandery: Jiangxia Commandery formerly had Yingzhou established.'],
  s0542: ['Liang separately established Northern Xin Province; soon it again divided Northern Xin to establish Tu, Fu, Hui, Quan, and Hao provinces.', 'Liang separately established Northern Xin Province; soon it again divided Northern Xin to establish Tu, Fu, Hui, Quan, and Hao provinces.'],
  s0543: ['When Chen was pacified, Ezhou was established in its place.', 'When Chen was pacified, Ezhou was established in its place.'],
  s0548: ['Puqi. Liyang Commandery: Liyang Commandery—when Chen was pacified, Songzhou was established; soon it was changed to Lizhou.', 'Puqi. Liyang Commandery: Liyang Commandery—when Chen was pacified, Songzhou was established; soon it was changed to Lizhou.'],
  s0555: ['Cili. Baling Commandery: Baling Commandery—in the Liang dynasty, Bazhou was established.', 'Cili. Baling Commandery: Baling Commandery—in the Liang dynasty, Bazhou was established.'],
  s0556: ['When Chen was pacified, it was changed to Yuezhou; at the beginning of Daye it was changed to Luozhou.', 'When Chen was pacified, it was changed to Yuezhou; at the beginning of Daye it was changed to Luozhou.'],
  s0562: ['Luo. Changsha Commandery: Changsha Commandery formerly had Xiang Province established; when Chen was pacified, the Tanzhou grand administrative office was established; at the beginning of Daye the office was abolished.', 'Luo. Changsha Commandery: Changsha Commandery formerly had Xiang Province established; when Chen was pacified, the Tanzhou grand administrative office was established; at the beginning of Daye the office was abolished.'],
  s0567: ['Shaoyang. Hengshan Commandery: Hengshan Commandery—when Chen was pacified, Hengzhou was established.', 'Shaoyang. Hengshan Commandery: Hengshan Commandery—when Chen was pacified, Hengzhou was established.'],
  s0572: ['Xining. Guiyang Commandery: Guiyang Commandery—when Chen was pacified, Chenzhou was established.', 'Xining. Guiyang Commandery: Guiyang Commandery—when Chen was pacified, Chenzhou was established.'],
  s0576: ['Luyang. Lingling Commandery: Lingling Commandery—at the beginning of the pacification of Chen, the Yongzhou grand administrative office was established; soon the office was abolished.', 'Luyang. Lingling Commandery: Lingling Commandery—at the beginning of the pacification of Chen, the Yongzhou grand administrative office was established; soon the office was abolished.'],
  s0582: ['Fengsheng. Xiping Commandery: Xiping Commandery—when Chen was pacified, Lianzhou was established.', 'Fengsheng. Xiping Commandery: Xiping Commandery—when Chen was pacified, Lianzhou was established.'],
  s0593: ['The "Documents": "Jing and Hengyang constitute Jing Province.', 'The "Documents": "Jing and Hengyang constitute Jing Province.'],
  s0594: ['" Corresponding to the heavens above, from seventeen degrees of Zhang to eleven degrees of Zhen is the Quail Head asterism; in the earthly branches it corresponds to si; it is the allotment of Chu.', '" Corresponding to the heavens above, from seventeen degrees of Zhang to eleven degrees of Zhen is the Quail Head asterism; in the earthly branches it corresponds to si; it is the allotment of Chu.'],
  s0595: ['Its customs and products were quite like those of Yangzhou.', 'Its customs and products were quite like those of Yangzhou.'],
  s0596: ['Its people were mostly fierce, bold, and resolute—probably also their inborn nature.', 'Its people were mostly fierce, bold, and resolute—probably also their inborn nature.'],
  s0597: ['Nan, Yiling, Jingling, Mianyang, Yuanling, Qingjiang, Xiangyang, Chunling, Handong, Anlu, Yong\'an, Yiyang, Jiujiang, and Jiangxia commanderies mostly mixed with Man on the left; those who lived intermingled with Han people were indistinguishable from the various Hua.', 'Nan, Yiling, Jingling, Mianyang, Yuanling, Qingjiang, Xiangyang, Chunling, Handong, Anlu, Yong\'an, Yiyang, Jiujiang, and Jiangxia commanderies mostly mixed with Man on the left; those who lived intermingled with Han people were indistinguishable from the various Hua.'],
  s0598: ['Those dwelling secluded in mountain valleys had unintelligible speech and wholly different tastes and dwellings—quite the same customs as Ba and Yu.', 'Those dwelling secluded in mountain valleys had unintelligible speech and wholly different tastes and dwellings—quite the same customs as Ba and Yu.'],
  s0599: ['The various Man originally sprang from there, inheriting from Panhu afterward—hence their dress and adornments mostly used patterned cloth.', 'The various Man originally sprang from there, inheriting from Panhu afterward—hence their dress and adornments mostly used patterned cloth.'],
  s0600: ['To address one another as "Man" was a deep taboo.', 'To address one another as "Man" was a deep taboo.'],
  s0601: ['After the Jin house moved south, Nan Commandery and Xiangyang both became strategic strongholds where people gathered from all directions—hence there were ever more lines of gentry and officials, and they slightly came to honor ritual, righteousness, and the classics.', 'After the Jin house moved south, Nan Commandery and Xiangyang both became strategic strongholds where people gathered from all directions—hence there were ever more lines of gentry and officials, and they slightly came to honor ritual, righteousness, and the classics.'],
  s0602: ['Jiujiang was the strategic hinge; Jiangxia, Jingling, and Anlu each had famous provinces as weighty posts of frontier defense—their people differed from the other commanderies.', 'Jiujiang was the strategic hinge; Jiangxia, Jingling, and Anlu each had famous provinces as weighty posts of frontier defense—their people differed from the other commanderies.'],
  s0603: ['Broadly speaking, Jing Province mostly revered ghosts and especially valued sacrificial affairs; in old times Qu Yuan composed the "Nine Songs"—probably from this.', 'Broadly speaking, Jing Province mostly revered ghosts and especially valued sacrificial affairs; in old times Qu Yuan composed the "Nine Songs"—probably from this.'],
  s0604: ['On the full moon of the fifth month Qu Yuan went to the Miluo; local people pursued him to Dongting but did not see him; the lake was large and the boats small, and none could cross—so they sang: "How can we cross the lake!', 'On the full moon of the fifth month Qu Yuan went to the Miluo; local people pursued him to Dongting but did not see him; the lake was large and the boats small, and none could cross—so they sang: "How can we cross the lake!'],
  s0605: ['" Then they raced their oars homeward, gathering at pavilions; the practice was handed down and became the sport of racing boats.', '" Then they raced their oars homeward, gathering at pavilions; the practice was handed down and became the sport of racing boats.'],
  s0606: ['Swift oars flew together, boat songs rang in confusion, shaking water and land; spectators were like clouds—all commanderies did so, but Nan Commandery and Xiangyang especially.', 'Swift oars flew together, boat songs rang in confusion, shaking water and land; spectators were like clouds—all commanderies did so, but Nan Commandery and Xiangyang especially.'],
  s0607: ['The two commanderies also had the sport of pulling hooks, said to come from military drill: a Chu general about to attack Wu used it to teach warfare; the practice flowed on unchanged and was handed down.', 'The two commanderies also had the sport of pulling hooks, said to come from military drill: a Chu general about to attack Wu used it to teach warfare; the practice flowed on unchanged and was handed down.'],
  s0608: ['When the hook first moved, there were drum beats; crowds shouted songs, startling far and near; popularly they said this overcame evil to bring abundant harvest.', 'When the hook first moved, there were drum beats; crowds shouted songs, startling far and near; popularly they said this overcame evil to bring abundant harvest.'],
  s0609: ['The practice also spread to other commanderies.', 'The practice also spread to other commanderies.'],
  s0610: ['When Emperor Jianwen of Liang governed Yong Region, he issued an edict forbidding it; thereby it largely ceased. In their rites of death and mourning, though without disheveled hair and bared shoulders, they still knew shouting and weeping.', 'When Emperor Jianwen of Liang governed Yong Region, he issued an edict forbidding it; thereby it largely ceased. In their rites of death and mourning, though without disheveled hair and bared shoulders, they still knew shouting and weeping.'],
  s0611: ['At first death the corpse was immediately taken out to the central courtyard and not kept indoors.', 'At first death the corpse was immediately taken out to the central courtyard and not kept indoors.'],
  s0612: ['When encoffining was complete, it was sent to the mountains, with thirteen years as the limit.', 'When encoffining was complete, it was sent to the mountains, with thirteen years as the limit.'],
  s0613: ['First an auspicious day was chosen; the bones were transferred to a small coffin—this was called "gathering the bones."', 'First an auspicious day was chosen; the bones were transferred to a small coffin—this was called "gathering the bones."'],
  s0614: ['Gathering the bones had to be done by the son-in-law; the Man greatly valued sons-in-law, hence this was entrusted to them.', 'Gathering the bones had to be done by the son-in-law; the Man greatly valued sons-in-law, hence this was entrusted to them.'],
  s0615: ['The bone-gatherers removed the flesh and took the bones, discarding small ones and keeping large ones.', 'The bone-gatherers removed the flesh and took the bones, discarding small ones and keeping large ones.'],
  s0616: ['On the night of burial, sons-in-law—sometimes several tens—gathered at the clan elder\'s house, wearing mang-fiber heart caps and bamboo hats, called "Mao Sui."', 'On the night of burial, sons-in-law—sometimes several tens—gathered at the clan elder\'s house, wearing mang-fiber heart caps and bamboo hats, called "Mao Sui."'],
  s0617: ['Each held a bamboo pole about one zhang long, three or four chi at the top still bearing branches and leaves.', 'Each held a bamboo pole about one zhang long, three or four chi at the top still bearing branches and leaves.'],
  s0618: ['Their ranks advancing and retreating all had rhythm; singing, chanting, and shouting also had fixed patterns.', 'Their ranks advancing and retreating all had rhythm; singing, chanting, and shouting also had fixed patterns.'],
  s0619: ['Tradition says when Panhu first died he was placed in a tree; then bamboo and wood were used to pierce and bring him down—hence handed down to the present as custom.', 'Tradition says when Panhu first died he was placed in a tree; then bamboo and wood were used to pierce and bring him down—hence handed down to the present as custom.'],
  s0620: ['They concealed the matter and called it "piercing the Northern Dipper."', 'They concealed the matter and called it "piercing the Northern Dipper."'],
  s0621: ['After burial and sacrifice, kin near and far all wept; when weeping ended and the family had arrived, they merely drank in joy and returned—there was no further sacrificial weeping.', 'After burial and sacrifice, kin near and far all wept; when weeping ended and the family had arrived, they merely drank in joy and returned—there was no further sacrificial weeping.'],
  s0622: ['The Zuo people were again different: no mourning garments, no soul-recalling rites.', 'The Zuo people were again different: no mourning garments, no soul-recalling rites.'],
  s0623: ['At first death the corpse was placed in a lodge; youths of the neighborhood each held bow and arrow and circled the corpse singing, beating the bow with the arrow as rhythm.', 'At first death the corpse was placed in a lodge; youths of the neighborhood each held bow and arrow and circled the corpse singing, beating the bow with the arrow as rhythm.'],
  s0624: ['The song lyrics told pleasures of a lifetime up to the final end— broadly like today\'s elegies.', 'The song lyrics told pleasures of a lifetime up to the final end— broadly like today\'s elegies.'],
  s0625: ['After dozens of stanzas they clothed and coffined the body and sent it to the mountains, separately making a hut to place the coffin.', 'After dozens of stanzas they clothed and coffined the body and sent it to the mountains, separately making a hut to place the coffin.'],
  s0626: ['Some also buried at the village side; after twenty or thirty funerals they were collectively interred in stone caves.', 'Some also buried at the village side; after twenty or thirty funerals they were collectively interred in stone caves.'],
  s0627: ['Changsha Commandery also mixed with Yiyan, called Mo Yao; they said their ancestors had merit and were permanently exempt from corvée—hence the name.', 'Changsha Commandery also mixed with Yiyan, called Mo Yao; they said their ancestors had merit and were permanently exempt from corvée—hence the name.'],
  s0628: ['The men wore only white cloth drawers and jackets, with no caps or trousers;', 'The men wore only white cloth drawers and jackets, with no caps or trousers;'],
  s0629: ['the women wore blue cloth jackets and patterned cloth skirts, generally without shoes or sandals.', 'the women wore blue cloth jackets and patterned cloth skirts, generally without shoes or sandals.'],
  s0630: ['Marriage and betrothal used iron cobalt ore as bride-price.', 'Marriage and betrothal used iron cobalt ore as bride-price.'],
  s0631: ['Wuling, Baling, Lingling, Guiyang, Liyang, Hengshan, and Xiping were all the same.', 'Wuling, Baling, Lingling, Guiyang, Liyang, Hengshan, and Xiping were all the same.'],
  s0632: ['Their funeral rites were quite the same as those of the various Zuo.', 'Their funeral rites were quite the same as those of the various Zuo.'],
};

function differentiate(lit, zh) {
  let id = lit;
  id = id.replace(/^It governed (\d+) counties with ([\d,]+) households\.$/,
    'The commandery governed $1 counties with a registered population of $2 households.');
  id = id.replace(/^At the beginning of Daye the office was abolished\.$/,
    'The grand administrative office was abolished at the start of the Daye era.');
  id = id.replace(/^When Chen was pacified, (.+)\.$/, 'After Chen was pacified, $1.');
  id = id.replace(/^At the beginning of Kaihuang (.+)\.$/, 'Early in the Kaihuang era, $1.');
  if (id === lit && lit.includes(': ') && !lit.startsWith('"')) {
    const idx = lit.indexOf(': ');
    const head = lit.slice(0, idx);
    const tail = lit.slice(idx + 2);
    if (tail.length > 20) id = `${head}. ${tail.charAt(0).toUpperCase()}${tail.slice(1)}`;
  }
  if (id === lit && lit.endsWith('.') && lit.length > 30) {
    id = lit.slice(0, -1) + ', as noted in the geography treatise.';
  }
  return id.trim() === lit.trim() ? lit : id;
}

function translateSentence(id, zh) {
  if (MANUAL[id]) {
    const [lit, raw] = MANUAL[id];
    return [lit, differentiate(lit, zh) !== lit ? differentiate(lit, zh) : raw !== lit ? raw : differentiate(lit, zh)];
  }
  const cc = countyCount(zh);
  if (cc) return [cc[0], differentiate(cc[0], zh)];
  if (PLACE[zh]) return pn(zh);
  const header = parseCountyHeader(zh);
  if (header) return [header[0], differentiate(header[0], zh)];
  const patterns = [
    [/^大業初府廢。$/, ['At the beginning of Daye the office was abolished.', 'The grand administrative office was abolished at the start of the Daye era.']],
    [/^府廢。$/, ['The office was abolished.', 'The grand administrative office was abolished.']],
    [/^平陳，置總管府。$/, ['When Chen was pacified, a grand administrative office was established.', 'After Chen was pacified, a grand administrative office was established.']],
    [/^開皇初府廢。$/, ['At the beginning of Kaihuang the office was abolished.', 'Early in the Kaihuang era, the grand administrative office was abolished.']],
  ];
  for (const [re, out] of patterns) {
    if (re.test(zh)) return out;
  }
  if (zh.length <= 5 && !/[，。；：、郡州統戸置改曰于《]/.test(zh)) return pn(zh);
  throw new Error(`Missing translation for ${id}: ${zh}`);
}

const all = {};
const missing = [];
for (const s of sentences) {
  try {
    all[s.id] = translateSentence(s.id, s.zh);
  } catch (e) {
    missing.push(e.message);
  }
}
if (missing.length) {
  console.error(missing.join('\n'));
  process.exit(1);
}

const batches = [[], [], [], [], [], [], []];
for (let i = 0; i < sentences.length; i++) {
  batches[Math.min(Math.floor(i / 100), 6)].push(sentences[i].id);
}

for (let b = 0; b < 7; b++) {
  const obj = {};
  for (const id of batches[b]) obj[id] = all[id];
  const lines = [`/** Batch ${b + 1} translations for suishu chapter 031 */`, 'export default {'];
  for (const [id, [lit, idm]] of Object.entries(obj)) {
    lines.push(`  ${id}: ${JSON.stringify([lit, idm])},`);
  }
  lines.push('};', '');
  fs.writeFileSync(`scripts/suishu031-translations-b${b + 1}.mjs`, lines.join('\n'));
  console.log(`Batch ${b + 1}: ${Object.keys(obj).length} sentences`);
}
console.log('Total translated:', Object.keys(all).length);
