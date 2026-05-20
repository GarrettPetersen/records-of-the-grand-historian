#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'Xu Xin acted as Shaanxi governor; Alejing\'a acted as Shanxi governor.',
    'Xu Xin took acting Shaanxi and Alejing\'a acting Shanxi.',
  ],
  s0802: [
    'On day jiwei, Yang Yuchun was made imperial commissioner to supervise military affairs.',
    'On jiwei day, Yang Yuchun became imperial commissioner over the campaign.',
  ],
  s0803: [
    'Yinghui acted as Heilongjiang general.',
    'Yinghui acted as Heilongjiang general.',
  ],
  s0804: [
    'On day dingmao, Changling was ordered as imperial commissioner to lead Guilun, Alehanbao, and others to Xinjiang.',
    'On dingmao day, Changling was sent as imperial commissioner with Guilun and Alehanbao to Xinjiang.',
  ],
  s0805: [
    'On day xinwei, Yuying acted as Heilongjiang general.',
    'On xinwei day, Yuying acted as Heilongjiang general.',
  ],
  s0806: [
    'On day yihai, the Emperor reviewed Firearms Brigade troops.',
    'On yihai day, the Emperor reviewed the Firearms Brigade.',
  ],
  s0807: [
    'On day dingchou, Grand Secretary Jiang Youshen was demoted to vice minister for a criminal-case error.',
    'On dingchou day, Jiang Youshen was demoted from Grand Secretary for a trial error.',
  ],
  s0808: [
    'Xu Xin was summoned to the capital; Yan Bozhao acted as Shaanxi governor.',
    'Xu Xin was recalled and Yan Bozhao acted as Shaanxi governor.',
  ],
  s0809: [
    'Lu Yinpu was made Grand Secretary; Li Hongbin cooperating Grand Secretary while remaining Guangdong governor-general.',
    'Lu Yinpu became Grand Secretary; Li Hongbin joined as assistant while keeping Guangdong.',
  ],
  s0810: [
    'Tang Jinzhao was transferred as Minister of Personnel; Wang Yinzhi Minister of Rites; Pan Shien Minister of Works; Zhu Shiyan Left Censor-in-Chief.',
    'Tang Jinzhao took Personnel, Wang Yinzhi Rites, Pan Shien Works, and Zhu Shiyan the left censorate.',
  ],
  s0811: [
    'That month, earthquake relief was given for Cizhou and two other prefectures and counties in Zhili, and flood relief for Pengcheng and one other county in Sichuan.',
    'That month, Zhili earthquake districts and two Sichuan flood counties were relieved.',
  ],
  s0812: [
    'Tenth month: Lu Yinpu was made Grand Secretary of the Tirenge Pavilion.',
    'In the tenth month, Lu Yinpu became Tirenge Grand Secretary.',
  ],
  s0813: [
    'On day wuzi, Funiyang\'a was made Zhejiang governor.',
    'On wuzi day, Funiyang\'a became Zhejiang governor.',
  ],
  s0814: [
    'On day yiwei, Changling was again appointed Yangwei General; Hala\'a and Yang Fang were ordered to assist in military affairs.',
    'On yiwei day, Changling was again made Yangwei General; Hala\'a and Yang Fang assisted the campaign.',
  ],
  s0815: [
    'On day gengzi, Leshan was made Uliasutai general.',
    'On gengzi day, Leshan became Uliasutai general.',
  ],
  s0816: [
    'On day xinchou, for delay in military affairs, Ili assistant commissioner Rong\'an was stripped of office and his inherited viscount rank.',
    'On xinchou day, Rong\'an lost office and his viscount title for military delay.',
  ],
  s0817: [
    'On day renyin, Enming was made Uliasutai assistant commissioner.',
    'On renyin day, Enming became Uliasutai assistant commissioner.',
  ],
  s0818: [
    'On day guimao, Muslim rebels attacked Yarkand; Bichang and others defeated them.',
    'On guimao day, rebels struck Yarkand and Bichang repulsed them.',
  ],
  s0819: [
    'On day dingwei, Rong\'an was arrested.',
    'On dingwei day, Rong\'an was arrested.',
  ],
  s0820: [
    'On day renzi, Funiyang\'a was summoned to the capital.',
    'On renzi day, Funiyang\'a was recalled to Beijing.',
  ],
  s0821: [
    'That month, disaster victims were relieved in Dacheng and Wen\'an, two counties in Zhili.',
    'That month, Dacheng and Wen\'an in Zhili received disaster relief.',
  ],
  s0822: [
    'Rations were distributed to five prefectures, counties, and garrisons including Wuhu in Anhui.',
    'Anhui districts including Wuhu received ration relief.',
  ],
  s0823: [
    'Granary grain was loaned to banner people in three places including Heilongjiang, and rations loaned to the poor in eleven prefectures and counties including Gaolan in Gansu.',
    'Heilongjiang bannermen and eleven Gansu districts including Gaolan received grain loans.',
  ],
  s0824: [
    'Eleventh month: Yang Yizeng was made Hubei governor.',
    'In the eleventh month, Yang Yizeng became Hubei governor.',
  ],
  s0825: [
    'On day yihai, Li Hongbin and others were sternly instructed to investigate Guangdong secret societies.',
    'On yihai day, Li Hongbin was ordered to root out Guangdong secret societies.',
  ],
  s0826: [
    'On day dingchou, Wu Guangyue was instructed to investigate secret societies in southern Gannan, Jiangxi.',
    'On dingchou day, Wu Guangyue was told to suppress Jiangxi Gannan secret societies.',
  ],
  s0827: [
    'On day renwu, Songfu was demoted and transferred; Lukang was made Huguang governor-general.',
    'On renwu day, Songfu was demoted and Lukang became Huguang governor-general.',
  ],
  s0828: [
    'Cheng Zuluo was transferred as Jiangsu governor, and Su Chenge Hunan governor.',
    'Cheng Zuluo took Jiangsu and Su Chenge Hunan.',
  ],
  s0829: [
    'Qi Yu was made Guangxi governor.',
    'Qi Yu became Guangxi governor.',
  ],
  s0830: [
    'Alejing\'a was made Jiangxi governor.',
    'Alejing\'a became Jiangxi governor.',
  ],
  s0831: [
    'That month, earthquake relief was given for Anyang and two other counties in Henan.',
    'That month, Anyang and two other Henan counties were relieved after the earthquake.',
  ],
  s0832: [
    'Funds were given to Luling County, Jiangxi, to repair houses after flood damage.',
    'Luling in Jiangxi received flood-damage house-repair funds.',
  ],
  s0833: [
    'Twelfth month, day guisi: Tuojin was relieved of managing the Board of Punishments; Lu Yinpu replaced him.',
    'In the twelfth month, on guisi day, Tuojin left punishments and Lu Yinpu took over.',
  ],
  s0834: [
    'On day bingshen, Muslim rebels in Kashgar and Yengisar were pacified.',
    'On bingshen day, Kashgar and Yengisar rebels were pacified.',
  ],
  s0835: [
    'Taskha, the Kashgar assistant commissioner who died in service, was granted military superintendent rank posthumously.',
    'Taskha, the Kashgar aide killed in action, was posthumously given superintendent rank.',
  ],
  s0836: [
    'That month, flood relief was given for Yixian County in Yunnan.',
    'That month, Yunnan\'s Yixian County received flood relief.',
  ],
  s0837: [
    'Silver and grain were loaned to soldiers stationed near disaster areas in four prefectures and districts including Suzhou in Jiangsu.',
    'Jiangsu troops near disaster zones, including Suzhou, received silver and grain loans.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_017_b09.mjs <translation.json>'
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
