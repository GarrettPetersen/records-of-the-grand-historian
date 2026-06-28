#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-qingshigao.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-qingshigao-157-wikisource-4ca0ab99914a': [
    {
      zh: '咸豐十一年，布路斯及德意志諸國請照英、法等國換約，江蘇巡撫薛煥不可。',
      literal: 'In the eleventh year of Xianfeng, Prussia and the German states requested treaty revision on the model of Britain, France, and other powers; Jiangsu Governor Xue Huan would not agree.',
      idiomatic: 'In the eleventh year of Xianfeng (1861), Prussia and the German states asked to revise their treaties on the same terms as Britain, France, and the other powers; Jiangsu Governor Xue Huan refused.',
    },
    {
      zh: '其使臣艾林波赴天津，呈三口通商大臣，請立條約。',
      literal: 'Its envoy Albrecht zu Eulenburg went to Tianjin, presented himself to the Commissioner for the Three Treaty Ports, and requested conclusion of a treaty.',
      idiomatic: 'The envoy Count Albrecht zu Eulenburg went to Tianjin, presented himself to the Commissioner for the Three Treaty Ports, and asked to conclude a treaty.',
    },
    {
      zh: '王大臣以聞，命總理各國事務、倉場總督崇綸充全權大臣，赴天津會崇厚酌辦。',
      literal: 'The senior ministers reported it, and Chonglun, Superintendent of the Granary and Commissioner for Foreign Affairs, was appointed plenipotentiary and sent to Tianjin to consult with Chonghou and handle the matter.',
      idiomatic: 'The senior ministers memorialized the court, and Chonglun, Superintendent of the Granary and Commissioner for Foreign Affairs, was appointed plenipotentiary and sent to Tianjin to consult with Chonghou and settle the matter.',
    },
    {
      zh: '布使呈條約四十二款，附款一條，通商章程十款，另款一條，稅則一冊，其代呈德意志公會各國部名，均照布國條約辦理。',
      literal: 'The Prussian envoy submitted a treaty of forty-two articles, one supplementary article, ten commercial regulations, another supplementary article, and a tariff schedule; the names of the German Confederation states he presented on their behalf were all to be handled according to the Prussian treaty.',
      idiomatic: 'The Prussian envoy submitted a treaty of forty-two articles, one supplementary article, ten commercial regulations, another supplementary article, and a tariff schedule; the names of the German Confederation states he presented on their behalf were all to be handled under the Prussian treaty.',
    },
    {
      zh: '既又稱，日爾曼通商諸國欲在臺灣之雞籠、浙江之溫州通商，並照各國駐京辦事。',
      literal: 'He further stated that the German trading states wished to trade at Jilong in Taiwan and Wenzhou in Zhejiang, and to station representatives in Beijing like the other powers.',
      idiomatic: 'He further asked that the German trading states be allowed to trade at Jilong in Taiwan and Wenzhou in Zhejiang, and to station representatives in Beijing on the same terms as the other powers.',
    },
    {
      zh: '崇綸覆以日爾曼各國通商，均歸布路斯統轄約束，只辦通商，不得涉別事；',
      literal: 'Chonglun replied that German trade among the various states was all under Prussian jurisdiction and restraint, limited to commerce and not to extend to other matters;',
      idiomatic: 'Chonglun replied that trade among the German states was subject to Prussian jurisdiction, limited to commerce alone and not to extend to other matters;',
    },
    {
      zh: '並諭以京師非貿易之區，不能派員常駐；',
      literal: 'and instructed that Beijing was not a trading district and could not have a permanently stationed officer;',
      idiomatic: 'and explained that Beijing was not a trading district and could not have a permanently stationed officer;',
    },
    {
      zh: '至雞籠、溫州二處，為英、法兩國條約所無，不能增益。',
      literal: 'as for Jilong and Wenzhou, these were not in the British and French treaties and could not be added.',
      idiomatic: 'as for Jilong and Wenzhou, these were not provided for in the British and French treaties and could not be added.',
    },
    {
      zh: '時當四國換約，法使哥士耆言：「日爾曼各國，其最大者為布路斯，此外尚有邦晏等二十餘國，一切章程歸布國議定。」',
      literal: 'At the time of the four-power treaty revision, French minister Gros said: "Among the German states, the largest is Prussia; besides this there are more than twenty others such as Bavaria, and all regulations are determined by Prussia."',
      idiomatic: 'During the four-power treaty revision, French minister Gros said: "Among the German states, the largest is Prussia; besides it there are more than twenty others such as Bavaria, and all regulations are determined by Prussia."',
    },
    {
      zh: '崇綸等以所言告總署，總署令哥士耆代阻之。',
      literal: 'Chonglun and the others reported Gros\'s words to the Yamen, and the Yamen ordered Gros to help obstruct the request.',
      idiomatic: 'Chonglun and his colleagues reported Gros\'s statement to the Zongli Yamen, which asked Gros to help block the request.',
    },
    {
      zh: '忽有布國人入京，直入輔國將軍奕權宅強住。',
      literal: 'Suddenly Prussians entered the capital and went straight into the residence of Assistant Prince Yi Quan and forcibly lodged there.',
      idiomatic: 'Suddenly Prussians entered Beijing, went straight to the residence of Assistant Prince Yi Quan, and forcibly took up lodging there.',
    },
    {
      zh: '總理各國事務、戶部左侍郎文祥赴英館晤英使普魯斯，言：「布國既不以禮來，我國即不能以禮往。」',
      literal: 'Wen Xiang, Commissioner for Foreign Affairs and Left Vice Minister of Revenue, went to the British legation to meet British minister Bruce and said: "Since Prussia has not come with courtesy, our country likewise cannot respond with courtesy."',
      idiomatic: 'Wen Xiang, Commissioner for Foreign Affairs and Left Vice Minister of Revenue, called on British minister Bruce at the legation and said: "Since Prussia has not come with courtesy, China cannot respond with courtesy."',
    },
    {
      zh: '並告以：「艾林波如或來京，亦當拒之，不得謂中國無禮也。」',
      literal: 'He also said: "If Albrecht zu Eulenburg should come to the capital, he too must be refused, so that China cannot be said to be discourteous."',
      idiomatic: 'He also said: "If Albrecht zu Eulenburg should come to Beijing, he too must be refused, so that China cannot be accused of discourtesy."',
    },
    {
      zh: '普魯斯請牒知艾林波，令迅速調回。',
      literal: 'Bruce asked to send a dispatch informing Albrecht zu Eulenburg and ordering him to return promptly.',
      idiomatic: 'Bruce offered to notify Albrecht zu Eulenburg by dispatch and have him recalled at once.',
    },
    {
      zh: '未幾，布人相率回津，而艾林波牒總署，猶要求如故。',
      literal: 'Before long the Prussians returned in a body to Tianjin, but Albrecht zu Eulenburg sent a note to the Yamen still demanding as before.',
      idiomatic: 'Before long the Prussians withdrew to Tianjin in a body, but Albrecht zu Eulenburg sent a note to the Zongli Yamen repeating his original demands.',
    },
    {
      zh: '遂定議以五年後許派秉權大臣一員駐京，兼辦各國事，餘與法國條約略同。',
      literal: 'It was then agreed that after five years one plenipotentiary minister might be stationed in the capital to handle affairs of all states as well; the rest was roughly the same as the French treaty.',
      idiomatic: 'It was then agreed that after five years one plenipotentiary minister might be stationed in Beijing to handle affairs of all the German states as well; the remainder was roughly the same as the French treaty.',
    },
    {
      zh: '是為德意志與中國立約之始。',
      literal: 'This was the beginning of treaty relations between Germany and China.',
      idiomatic: 'This marked the beginning of treaty relations between Germany and China.',
    },
    {
      zh: '約既定，總署又恐五年後布國派員來京，仿照英、法國住居府第，復函屬崇綸等令其將不住府第一層載明約內。',
      literal: 'Once the treaty was settled, the Yamen feared that when Prussia sent an officer to the capital five years later he would imitate the British and French residences; it again wrote instructing Chonglun and the others to have the provision that no official residence would be occupied written into the treaty.',
      idiomatic: 'Once the treaty was settled, the Zongli Yamen feared that when Prussia sent a minister to Beijing five years later he would follow the British and French model of an official residence; it again instructed Chonglun and his colleagues to have the provision that no official residence would be occupied written into the treaty.',
    },
    {
      zh: '艾林波允遞牒聲明將來不住府第，由中國給一空閒地基，聽其自行修蓋，許之。',
      literal: 'Albrecht zu Eulenburg agreed to submit a note declaring that in future he would not occupy an official residence, and that China would provide an empty plot of land for him to build on at his own discretion; this was permitted.',
      idiomatic: 'Albrecht zu Eulenburg agreed to submit a note declaring that in future he would not occupy an official residence and that China would provide an empty plot for him to build on as he saw fit; this was granted.',
    },
    {
      zh: '艾林波隨來京詣總署謁見，未幾回津。',
      literal: 'Albrecht zu Eulenburg then came to the capital to pay his respects at the Yamen, and soon returned to Tianjin.',
      idiomatic: 'Albrecht zu Eulenburg then came to Beijing to pay his respects at the Zongli Yamen, and soon returned to Tianjin.',
    },
    {
      zh: '同治元年冬，布使列斐士牒辦理通商事務大臣薛煥、江蘇巡撫李鴻章，謂換約一事，德意志公會內，除本國外，尚有二十二國，曰拜晏，曰撤遜，曰漢諾威，曰威而顛白而額，曰巴敦，曰黑辛加習利，曰黑星達而未司大，曰布倫帥額，曰阿爾敦布林額，曰魯生布而額，曰撤遜外抹艾生納，曰撤遜麥寧恩，曰撤遜阿里廷部而額，曰撤遜各部而額大，曰拏掃，曰宜得克比而孟地，曰安阿而得疊掃郭定，曰安阿而得比爾你布而額，曰立貝，曰實瓦字部而魯德司答，曰實瓦字部而孫德而士好遜，曰大支派之各洛以斯，曰小支派之各洛以斯，曰郎格缶而德，曰昂布而士，曰模令布而額水林，曰模令布而額錫特利子，曰律百克，曰伯磊門昂布林。',
      literal: 'In the winter of the first year of Tongzhi, Prussian minister von Rehfues sent a note to Trade Commissioner Xue Huan and Jiangsu Governor Li Hongzhang regarding treaty revision, stating that within the German Confederation, apart from Prussia itself, there were twenty-two other states, namely Bavaria, Saxony, Hanover, Württemberg, Baden, Hesse-Cassel, Hesse-Darmstadt, Brunswick, Oldenburg, Lübeck, Saxony-Altenburg, Saxony-Meiningen, Saxe-Weimar-Eisenach, the Saxon grand duchy, Nassau, Schwarzburg-Sondershausen, Anhalt-Dessau, Anhalt-Bernburg, Lippe, Schwarzburg-Rudolstadt, Schwarzburg-Sondershausen-Hohnstein, the elder line of Waldeck, the younger line of Waldeck, Reuss-Lobenstein, Reuss-Greiz, Mecklenburg-Schwerin, Mecklenburg-Strelitz, Lübeck, and Bremen.',
      idiomatic: 'In the winter of the first year of Tongzhi (1862), Prussian minister von Rehfues sent a note to Trade Commissioner Xue Huan and Jiangsu Governor Li Hongzhang on treaty revision, stating that within the German Confederation, apart from Prussia itself, there were twenty-two other states, namely Bavaria, Saxony, Hanover, Württemberg, Baden, Hesse-Cassel, Hesse-Darmstadt, Brunswick, Oldenburg, Lübeck, Saxony-Altenburg, Saxony-Meiningen, Saxe-Weimar-Eisenach, the Saxon grand duchy, Nassau, Schwarzburg-Sondershausen, Anhalt-Dessau, Anhalt-Bernburg, Lippe, Schwarzburg-Rudolstadt, Schwarzburg-Sondershausen-Hohnstein, the elder line of Waldeck, the younger line of Waldeck, Reuss-Lobenstein, Reuss-Greiz, Mecklenburg-Schwerin, Mecklenburg-Strelitz, Lübeck, and Bremen.',
    },
    {
      zh: '請將和約照錄二十二冊，鈐印分送各國，薛煥等不許。',
      literal: 'He requested that the treaty be copied in twenty-two volumes, sealed, and distributed to each state; Xue Huan and the others did not permit it.',
      idiomatic: 'He asked that the treaty be copied in twenty-two volumes, sealed, and distributed to each state; Xue Huan and his colleagues refused.',
    },
    {
      zh: '久之，始議會同互換和約，列舉德意志拜晏以下各國，不再分送。',
      literal: 'After a long time, joint exchange of the treaty was finally discussed, listing the German states from Bavaria downward, without separate distribution.',
      idiomatic: 'After prolonged negotiation, joint exchange of the treaty was finally agreed, listing the German states from Bavaria downward without separate distribution.',
    },
    {
      zh: '明年，列斐士復遣隨員韋根思敦來京，要求分送各國條約，鈐用江蘇籓司印，並請收各國國書，許之。',
      literal: 'The following year von Rehfues again sent his attaché Wegener to the capital, requesting distribution of the treaty to each state with the seal of the Jiangsu provincial treasurer, and asking to receive the credentials of each state; this was permitted.',
      idiomatic: 'The following year von Rehfues again sent his attaché Wegener to Beijing to request distribution of the treaty to each state under the seal of the Jiangsu provincial treasurer, and to receive the credentials of each state; permission was granted.',
    },
  ],
  'source-qingshigao-157-wikisource-bf49dd414f75': [
    {
      zh: '宣統元年，山東巡撫孫寶琦與德立山東收回五礦合同。',
      literal: 'In the first year of Xuantong, Shandong Governor Sun Baoqi concluded with Germany a contract for recovery of the five Shandong mining concessions.',
      idiomatic: 'In the first year of Xuantong (1909), Shandong Governor Sun Baoqi concluded with Germany a contract for the recovery of the five Shandong mining concessions.',
    },
    {
      zh: '先是光緒三十三年，山東巡撫楊士驤與德商採礦公司議定合同八條，所指之沂州、沂水、諸城、濰縣四處，已次第查勘，惟第五處礦界內寧海州屬之茅山金礦，查勘未竟。',
      literal: 'Previously, in the thirty-third year of Guangxu, Shandong Governor Yang Shixiang and the German mining company had agreed on a contract of eight articles; of the four places designated—Yizhou, Yishui, Zhucheng, and Weixian—survey had proceeded in turn, but the Maoshan gold mine within the fifth concession boundary in Ninghai prefecture had not yet been fully surveyed.',
      idiomatic: 'Previously, in Guangxu 33 (1907), Shandong Governor Yang Shixiang and the German mining company had agreed on an eight-article contract; of the four designated sites at Yizhou, Yishui, Zhucheng, and Weixian, surveys had proceeded in turn, but the Maoshan gold mine within the fifth concession boundary in Ninghai prefecture had not yet been fully surveyed.',
    },
    {
      zh: '會山東士民倡立保礦會，德公司遂欲將茅山轉售，向中國索價二百二十五萬馬克，並聲言此外四處一併歸還。',
      literal: 'When Shandong gentry and people organized a Mine Protection Society, the German company then wished to resell Maoshan, demanding from China 2,250,000 marks, and declaring that the other four places would be returned together with it.',
      idiomatic: 'When Shandong gentry and people organized a Mine Protection Society, the German company sought to resell Maoshan, demanding 2,250,000 marks from China and declaring that the other four sites would be returned together with it.',
    },
    {
      zh: '中國官紳亦以收回為然。',
      literal: 'Chinese officials and gentry also agreed that recovery was right.',
      idiomatic: 'Chinese officials and gentry also agreed that recovery was appropriate.',
    },
    {
      zh: '籌議久之，始以庫平銀三十四萬兩，分四年清還作結。',
      literal: 'After long deliberation, settlement was finally made at 340,000 taels of treasury silver, to be paid off over four years.',
      idiomatic: 'After prolonged deliberation, settlement was finally reached at 340,000 taels of treasury silver, payable over four years.',
    },
  ],
};

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
for (const [id, rows] of Object.entries(packets)) {
  const item = queue.items.find((x) => x.id === id);
  if (!item) throw new Error(`Missing ${id}`);
  item.manualTranslations = rows.map((row) => ({
    ...row,
    translator: T,
    model: M,
  }));
  item.acceptedSourceText = rows.map((r) => r.zh).join('');
  item.status = 'approved';
  item.decision = 'approved';
  item.notes = 'Restored missing upstream treaty and mining-contract text with manual translations.';
  item.reviewedAt = new Date().toISOString();
  item.reviewer = 'sdk-repair-chapter';
}
fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

for (const id of Object.keys(packets)) {
  execSync(
    `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${id} --item ${id} --reviewer sdk-repair-chapter`,
    { stdio: 'inherit' },
  );
}

console.log('Applied qingshigao/157 source correspondence omissions.');
