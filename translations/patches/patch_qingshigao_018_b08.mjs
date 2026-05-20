#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'Because Uergen\'e had not forwarded the British letter to the throne, he was arrested for trial.',
    'Uergen\'e was arrested for failing to forward the British letter.',
  ],
  s0702: [
    'That month, ration grain was issued to Taixing county, Jiangsu, for flood disaster.',
    'That month, Taixing in Jiangsu received flood rations.',
  ],
  s0703: [
    'Tenth month, day renshen: because the Emperor would visit the tombs, the Prince of Zhuang and others were left in the capital to handle affairs.',
    'In month 10, renshen, the Prince of Zhuang and others stayed in Beijing for the tomb visit.',
  ],
  s0704: [
    'On day renwu, as Empress Xiaoquan\'s coffin was placed at Longquan Valley, the Emperor went to Guande Hall to perform the ancestral offering rite.',
    'On renwu day, Empress Xiaoquan\'s coffin went to Longquan Valley and the Emperor offered at Guande Hall.',
  ],
  s0705: [
    'On day yiyou, Lupu was transferred to be Uliasutai general.',
    'On yiyou day, Lupu became Uliasutai general.',
  ],
  s0706: [
    'That month, disaster victims in three Zhili prefectures and counties including Cangzhou were relieved.',
    'That month, Cangzhou and two other Zhili districts received disaster relief.',
  ],
  s0707: [
    'Ration grain was issued to military and civil people in Dongliu and Hanshan counties, Anhui.',
    'Dongliu and Hanshan in Anhui received military and civil rations.',
  ],
  s0708: [
    'Ration grain was loaned for flood disaster at Baiqibao and Xiaoheishan in Fengtian.',
    'Flood rations were loaned at Fengtian\'s Baiqibao and Xiaoheishan.',
  ],
  s0709: [
    'Principal and miscellaneous quota levies, old and new, were remitted or deferred for flood disaster in thirty-three Zhili prefectures and counties including Cangzhou and eight Hubei prefectures, counties, and guards including Mianyang.',
    'Flood quotas were remitted or deferred for thirty-three Zhili districts including Cangzhou and eight Hubei districts including Mianyang.',
  ],
  s0710: [
    'Eleventh month, day gengyin: the Emperor visited the Western Tombs and remitted five-tenths of quota levies on places the route passed through.',
    'In month 11, gengyin, the Emperor visited the Western Tombs with half route-tax relief.',
  ],
  s0711: [
    'On day jiawu, the Emperor visited Tailing, Taidongling, and Changling, also went to the tomb palaces of Empresses Xiaomu and Xiaoshen to offer libation, and performed the transfer offering rite before Empress Xiaoquan\'s coffin.',
    'On jiawu day, the Emperor visited Tailing, Taidongling, and Changling, offered at Empresses Xiaomu and Xiaoshen\'s tombs, and performed the transfer rite for Empress Xiaoquan.',
  ],
  s0712: [
    'On day yiwei, Empress Xiaoquan\'s coffin was interred in the underground palace; the Emperor oversaw in person and ordered the prince to perform the rites.',
    'On yiwei day, Empress Xiaoquan was buried in the underground palace while the Emperor watched and had a prince perform the rites.',
  ],
  s0713: [
    'On day jihai, the Emperor returned to the capital.',
    'On jihai day, the Emperor returned to Beijing.',
  ],
  s0714: [
    'On day guimao, Lupu was made Jingzhou general and Yixiang was transferred to be Uliasutai general.',
    'On guimao day, Lupu took Jingzhou and Yixiang Uliasutai.',
  ],
  s0715: [
    'The British took Dinghai.',
    'The British captured Dinghai.',
  ],
  s0716: [
    'On day wushen, Uergen\'e was sentenced to strangulation.',
    'On wushen day, Uergen\'e was sentenced to strangulation.',
  ],
  s0717: [
    'On day renzi, Yilibu memorialized that the British demanded trade at Macao and Dinghai.',
    'On renzi day, Yilibu reported British demands to trade at Macao and Dinghai.',
  ],
  s0718: [
    'An edict ordered Qishan to make the British withdraw from Dinghai.',
    'The court ordered Qishan to get the British out of Dinghai.',
  ],
  s0719: [
    'On day guichou, because Zhou Tianjue had improperly applied corporal punishment, he was stripped of office and exiled to Yili.',
    'On guichou day, Zhou Tianjue lost his post and was exiled to Yili for improper corporal punishment.',
  ],
  s0720: [
    'Yutai was made Huguang governor-general and Wu Qijun Hunan governor.',
    'Yutai became Huguang governor-general and Wu Qijun Hunan governor.',
  ],
  s0721: [
    'That month, flood and drought disasters were relieved in sixteen Jiangsu counties including Shangyuan and Tianjin county, Zhili.',
    'That month, sixteen Jiangsu counties including Shangyuan and Tianjin in Zhili received flood-and-drought relief.',
  ],
  s0722: [
    'Military pay was loaned to the Jiangning garrison in Jiangsu and troops of each provincial and cooperative camp stationed in disaster areas, and ration grain, housing expenses, and other supplies were loaned to flooded colonist households at Mo\'ergen city, Heilongjiang.',
    'Jiangning garrison and provincial-cooperative disaster troops received pay loans, and Heilongjiang\'s Mo\'ergen colonists received flood rations and housing funds.',
  ],
  s0723: [
    'Old and new quota levies were remitted or deferred for seventy-two Jiangsu prefectures, counties, guards, and banners including Taizhou, Tianjin county, Zhili, and Hequ county, Shanxi.',
    'Taizhou and seventy-one other Jiangsu units, Tianjin, and Shanxi\'s Hequ had quotas remitted or deferred.',
  ],
  s0724: [
    'Twelfth month: as Empress Xiaoquan was elevated for joint worship at the Imperial Ancestral Hall, the Emperor personally went to announce sacrifice.',
    'In month 12, Empress Xiaoquan entered the Imperial Ancestral Hall and the Emperor announced the offering in person.',
  ],
  s0725: [
    'The next day, the fourth prince was ordered to perform the rites.',
    'The next day the fourth prince performed the rites by order.',
  ],
  s0726: [
    'On day wuchen, Yu Buyun was transferred to be Zhejiang provincial military commander.',
    'On wuchen day, Yu Buyun became Zhejiang military commander.',
  ],
  s0727: [
    'Tielin was made Chahar commandant and Engui left censor-in-chief.',
    'Tielin became Chahar commandant and Engui left censor-in-chief.',
  ],
  s0728: [
    'Bichang was made Ili assistant commissioner.',
    'Bichang became Ili assistant commissioner.',
  ],
  s0729: [
    'On day jimao, Wu Wenrong was transferred to be Hubei governor and Liu Hong\'ao was made Fujian governor.',
    'On jimao day, Wu Wenrong took Hubei and Liu Hong\'ao Fujian.',
  ],
  s0730: [
    'On day guiwei, Husong\'e was summoned to the capital and Enteheng\'e acted Shaanxi-Gansu governor-general.',
    'On guiwei day, Husong\'e was recalled to Beijing and Enteheng\'e acted at Shaanxi-Gansu.',
  ],
  s0731: [
    'That month, ration grain and housing repair funds were issued for flood disaster in Longxi and Nanjing counties, Fujian.',
    'That month, Longxi and Nanjing in Fujian received flood rations and housing funds.',
  ],
  s0732: [
    'Military pay was loaned to three Jiangsu camps including Jiangyin.',
    'Jiangyin and two other Jiangsu camps received pay loans.',
  ],
  s0733: [
    'Principal and miscellaneous quota levies, old and new, were remitted or deferred for flood and drought disaster in four Zhejiang counties including Changxing.',
    'Changxing and three other Zhejiang counties had flood-and-drought quotas remitted or deferred.',
  ],
  s0734: [
    'That year, Korea presented tribute.',
    'That year, Korea sent tribute.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_018_b08.mjs <translation.json>'
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
