import fs from 'node:fs';

const translations = new Map(Object.entries({
  'data/qingshigao/196.json:s0065': 'On the guisi day of the third month, he was transferred; Zhang Baixi was Minister of the Board of Personnel. On the jiayin day of the twelfth month, he was transferred while holding the same post.',
  'data/qingshigao/196.json:s0069': 'Chongli, Lu Chuanlin, Shixu, and Sun Jianai were transferred on the guisi day of the third month. Xu Fu was Minister of the Board of Rites.',
  'data/qingshigao/196.json:s0073': 'After Yude, Xu Huifeng, and Guiheng, Xue Yunsheng died on the yiwei day of the tenth month. On the bingshen day, Zhang Baixi and Ge Baohua were Ministers of the Board of Punishments. On the jiayin day of the twelfth month, he was transferred while holding that post.',
  'data/qingshigao/196.json:s0075': 'Songkai and Qu Hongji were transferred on the guimao day of the sixth month. On the jiachen day, Zhang Baixi was Minister of the Board of Works. On the bingshen day of the tenth month and again on the jiayin day of the twelfth month, he was transferred while holding that post.',
  'data/qingshigao/196.json:s0446': 'On the bingshen day of the first month, he was transferred; Zengchong was Right Vice Minister of the Board of Personnel. On the gengshen day of the sixth month, he was transferred while holding the same post.',
  'data/qingshigao/196.json:s0450': 'On the jihai day of the fifth month, Zhang Yinglin, Jingfeng, Zhang Bangrui, and Zengchong were transferred; Tieliang was Right Vice Minister of the Board of Revenue. On the jimao day of the eleventh month, he was transferred to the same post but did not take it up, serving only in an acting capacity.',
  'data/qingshigao/196.json:s0458': 'On the jihai day of the fifth month, he was transferred; Jinghou was Left Vice Minister of the Board of War. On the gengshen day of the sixth month, he was transferred while holding the same post.',
  'data/qingshigao/196.json:s0461': 'In the twelfth month, Qin Shouzhang, Enshun, and Lu Baozhong were transferred. On the renzi day, Zhang Renfu was Right Vice Minister of the Board of War. On the jiazi day, he was transferred while holding that post.',
  'data/qingshigao/196.json:s0914': 'On the bingshen day of the second month, he was transferred while Right Vice Minister of the Board of Personnel. On the dingyou day, he was transferred again, and Ruiliang became Right Vice Minister. On the xinhai day of the ninth month, he served as acting General of Suiyuan City; on the bingzi day of the twelfth month, he was reassigned as acting Right Vice Minister of the Board of Personnel.',
  'data/qingshigao/196.json:s1023': 'In the fourth month, the post was changed to Minister of Posts and Communications. On the jisi day of the ninth month, he was dismissed. Tang Shaoyi was Minister of Posts and Communications, and Wu Yusheng served in an acting capacity. On the jichou day of the ninth month, Yang Shiqi served as acting minister; on the jimao day of the eleventh month, he was relieved while acting as minister.',
  'data/qingshigao/197.json:s0821': 'On the dinghai day of the ninth month, he was appointed Governor-General of Shandong. On the yimao day of the tenth month, he was transferred, and Zu Zepu replaced him.',
  'data/qingshigao/197.json:s0822': 'On the dinghai day of the ninth month, Zu Zepu was appointed Governor-General of Shanxi. On the yimao day of the tenth month, he was transferred and replaced.',
  'data/qingshigao/197.json:s1214': 'On the bingchen day of the third month, after Zu Zepu, Liu Zhaoqi was Governor-General of Zhejiang-Fujian.',
  'data/qingshigao/197.json:s1215': 'Zhao Tingchen died in the second month.',
  'data/qingshigao/197.json:s1216': 'Liu Zhaoqi was transferred.',
  'data/qingshigao/197.json:s1219': 'Zhou Youde, Gan Wenkun, and Qu Jinmei were demoted. On the bingshen day of the seventh month, Shuai Yanbao was Governor-General of Grain Transport.',
  'data/qingshigao/197.json:s1220': 'On the bingshen day of the ninth month, Yang Maoxun retired. On the yichou day of the tenth month, Luoduo was Governor-General of River Control.',
  'data/qingshigao/197.json:s3742': 'On the jimao day of the fourth month, he was transferred and served as acting Governor-General of Sichuan-Shaanxi. On the renzi day of the seventh month, he was formally appointed. On the bingshen day of the ninth month, he came to court, and Tulichen served in an acting capacity.',
  'data/qingshigao/197.json:s3743': 'Jueluo Manbao died. On the wushen day of the tenth month, Gao Qizhuo was Governor-General of Min-Zhe.',
  'data/qingshigao/197.json:s3744': 'Yang Zongren died. On the jiaxu day of the eighth month, Li Chenglong was Governor-General of Huguang.',
  'data/qingshigao/197.json:s3746': 'Kong Yuxun and Gao Qizhuo were transferred. On the wushen day of the tenth month, Yiduli was Governor-General of Yunnan-Guizhou. On the gengyin day, he was transferred and replaced.',
  'data/qingshigao/197.json:s4084': 'On the gengyin day of the ninth month, Yin Jishan was summoned; Wei Tingzhen served as acting Governor-General of Liangjiang.',
  'data/qingshigao/197.json:s4085': 'On the wuxu day of the seventh month, Zhalang\'a was transferred; Liu Yuyi served as acting Governor-General of Shaanxi.',
  'data/qingshigao/197.json:s4087': 'On the guichou day of the second month, Huang Tinggui and Liu Shiming were sent on assignment; Hao Yulin served as acting Governor-General of Fujian.',
  'data/qingshigao/197.json:s4088': 'On the guichou day of the intercalary fifth month, Li Wei was transferred. On the wuxu day of the seventh month, Cheng Yuanzhang served as acting Governor-General of Zhejiang; on the guiwei day of the eighth month, he was formally appointed.',
  'data/qingshigao/197.json:s4090': 'On the wuzi day of the first month, Maizhu and Hao Yulin returned to office as Governor-General of Guangdong after recovering from illness. On the guichou day of the second month, he was transferred, and Omeida served in an acting capacity. On the guiwei day of the eighth month, the vacancy was filled.',
  'data/qingshigao/197.json:s4092': 'On the yiwei day of the second month, Gao Qizhuo and Xinggui were summoned; Wei Tingzhen was Governor-General of Grain Transport.',
  'data/qingshigao/197.json:s4096': 'On the xinmao day of the second month, Qisule, Ji Zengyun, Zhu Zao, and Shen Tingzheng were summoned; Wang Chao\'en was Governor-General of the Northern River. On the gengyin day of the ninth month, he was transferred and formally appointed.',
  'data/qingshigao/201.json:s1849': 'On the xinchou day of the fourth month, he was made Governor of Jiangxi. In the fifth month, he was relieved because of mourning. On the bingyin day, Li Shizhen replaced him. On the xinchou day of the twelfth month, he was transferred and replaced.',
  'data/qingshigao/201.json:s1987': 'On the bingxu day of the first month, he was transferred. On the bingyin day, he became Governor of Jiangning. On the jiashen day of the fifth month, he was transferred, and on the yimao day of the sixth month, Tang Bin replaced him.',
  'data/qingshigao/201.json:s1988': 'Xu Guoxiang was transferred. On the jiyou day of the second month, Xue Zhudou was Governor of Anhui.',
  'data/qingshigao/201.json:s1989': 'On the bingyin day of the ninth month, Xu Xuling was transferred. On the xinsi day, Zhang Peng was Governor of Shandong.',
  'data/qingshigao/201.json:s1995': 'Mu\'ersai, Wang Rizao, E\'kai, Ye Muji, Jin Hong, and Wang Guoan were transferred. On the jiyou day of the second month, Zhao Shilin was Governor of Zhejiang.',
  'data/qingshigao/201.json:s1997': 'An Shiding and Wang Xinming were transferred. On the jiwei day of the second month, Mu Tianyan was Governor of Huguang. On the wuyin day of the ninth month, he was transferred, and on the xinmao day, he was replaced.',
  'data/qingshigao/201.json:s2187': 'On the guimao day of the first month, he was dismissed. On the jiayin day of the second month, he was made Governor of Henan. On the dingwei day of the sixth month, he was transferred; Yan Xingbang was Governor of Henan.',
  'data/qingshigao/201.json:s2188': 'Buyanu retired in the ninth month. On the guimao day of the tenth month, Sabitu was Governor of Shaanxi.',
  'data/qingshigao/201.json:s2189': 'Ye Muji was transferred. On the jiashen day of the third month, Yitu was Governor of Gansu.',
  'data/qingshigao/201.json:s2192': 'On the yiwei day of the third month, Zhang Zhongju, Jin Hong, and Wang Zhi were transferred. On the dingwei day of the fourth month, Song Luo was Governor of Jiangxi.',
  'data/qingshigao/201.json:s2193': 'On the jiyou day of the second month, Ke Yongsheng was Governor of Huguang. On the jiachen day of the sixth month, Xia Baozi rebelled and died by throwing himself into a well. On the dingwei day, Ding Sikong replaced him. On the wuxu day of the ninth month, another officer was transferred in as replacement.',
  'data/qingshigao/201.json:s2384': 'On the xinmao day of the second month, he was dismissed. On the guimao day, he became Governor of Shaanxi. On the jimao day of the tenth month, he was dismissed, and on the jiachen day, Wuhe replaced him.',
  'data/qingshigao/201.json:s2385': 'Buka was transferred. On the guimao day of the second month, Wuhe was Governor of Gansu. On the jiachen day of the tenth month, he was transferred, and Yantai replaced him.',
  'data/qingshigao/201.json:s2388': 'Bian Yongyu, Zhang Penghe, and Song Luo were transferred. On the gengchen day of the sixth month, Ma Rulong was Governor of Jiangxi.',
  'data/qingshigao/201.json:s2389': 'On the gengxu day of the ninth month, Wu Tian was relieved because of mourning. On the jisi day, Sang\'e was Governor of Huguang. On the renchen day of the tenth month, he was transferred, and on the guisi day, he was replaced.',
  'data/qingshigao/201.json:s2672': 'On the renshen day of the second month, he was relieved because of illness. He was Governor of Zhili. On the dingyou day of the eleventh month, he was transferred, and on the xinchou day of the twelfth month, Li Guangdi replaced him.',
  'data/qingshigao/201.json:s2674': 'On the yiwei day of the eleventh month, Song Luo and Chen Ruqi were dismissed. On the gengzi day, Li Bing was Governor of Anhui.',
  'data/qingshigao/201.json:s2675': 'On the wuchen day of the second month, Li Wei was dismissed. On the renshen day, Li Bing was Governor of Shandong. On the yiyou day of the third month, he was relieved because of illness, and on the jichou day, he was replaced.',
  'data/qingshigao/201.json:s3955': 'On the wuwu day of the second month, he was dismissed while Governor of Zhejiang. On the renwu day of the eighth month, he was dismissed again, and Tongjitu served in an acting capacity. On the gengyin day, Shi Wenzhuo was transferred in to act. On the jiayin day of the eleventh month, he was transferred and replaced.',
  'data/qingshigao/201.json:s3998': 'On the jiazi day of the first month, he was dismissed while serving as acting Governor of Shanxi. On the wushen day of the tenth month, he was transferred, and Bulantai replaced him. On the gengyin day, Yiduli concurrently managed the governorship.',
  'data/qingshigao/201.json:s4000': 'On the jimao day of the fourth month, Tian Wenjing and Shi Wenzhuo were transferred; Tulichen served as acting Governor of Shaanxi.',
  'data/qingshigao/201.json:s4001': 'On the guihai day of the third month, Hu Siheng was removed. Yue Zhongqi concurrently administered the Gansu governorship. On the jimao day of the fourth month, Shi Wenzhuo replaced him. On the guihai day of the first month, Hu Siheng was summoned, and Peng Zhenyi served in an acting capacity.',
  'data/qingshigao/201.json:s4002': 'On the guihai day of the seventh month, Huang Guocai was dismissed; on the yichou day, Mao Wenquan was Governor of Fujian.',
  'data/qingshigao/201.json:s4003': 'On the jihai day of the sixth month, Fahai was summoned, and Gan Guokui served as acting Governor of Zhejiang. On the bingyin day of the eighth month, Famin served in an acting capacity; on the wushen day of the tenth month, Li Wei replaced him.',
  'data/qingshigao/201.json:s4005': 'Peidunaqiha died. On the bingchen day of the fifth month, Famin was Governor of Hubei. On the yichou day of the twelfth month, he was transferred while holding a concurrent post. On the gengxu day of the third month, he went on leave while concurrently serving in an acting capacity.',
  'data/qingshigao/201.json:s4047': 'On the bingwu day of the third month, he was summoned and served as acting Governor of Shanxi; he soon returned to his post. On the xinmao day of the eleventh month, he was transferred, and Deming replaced him.',
  'data/qingshigao/201.json:s4049': 'On the guiwei day of the eighth month, Tian Wenjing and Tulichen were summoned. Yue Zhongqi concurrently served as acting Governor of Shaanxi. On the dingchou day of the tenth month, Famin replaced him.',
  'data/qingshigao/201.json:s4051': 'On the bingwu day of the twelfth month, Shi Wenzhuo and Mao Wenquan were transferred; Changlai was Governor of Fujian.',
  'data/qingshigao/201.json:s4053': 'On the dingyou day of the fifth month, Li Wei and Peidu were transferred; Wang Long was Governor of Jiangxi. On the yiyou day of the tenth month, he was dismissed and Maizhu served in an acting capacity. On the xinmao day of the eleventh month, Yiduli replaced him.',
  'data/qingshigao/201.json:s4054': 'On the yihai day of the second month, Zheng Renyue was Governor of Hubei. On the yiyou day of the tenth month, he was transferred and Xiande replaced him.',
  'data/qingshigao/201.json:s4056': 'On the dingchou day of the tenth month, Bulantai and Famin were transferred; Ma Huibo was Governor of Sichuan.',
  'data/qingshigao/201.json:s4058': 'Yang Wenqian and Wang Long were transferred. On the dingyou day of the fifth month, Gan Rulai was Governor of Guangxi. On the guiwei day of the eighth month, he came to court and served in an acting capacity.',
  'data/qingshigao/201.json:s4098': 'On the wuxu day of the sixth month, he was dismissed while Governor of Shaanxi. On the dingsi day of the eleventh month, he was transferred, and Xilin replaced him.',
  'data/qingshigao/201.json:s4099': 'Shi Wenzhuo and Zhongbao administered the Gansu governorship. On the yichou day of the ninth month, he was dismissed; on the jiyou day of the tenth month, Mangguli served in an acting capacity.',
  'data/qingshigao/201.json:s4102': 'On the guiyou day of the fifth month, Changlai, Li Wei, and Yiduli were summoned; Bulantai was Governor of Jiangxi.',
  'data/qingshigao/201.json:s4103': 'On the guiyou day of the fifth month, Xiande was transferred; Ma Huibo was Governor of Hubei.',
  'data/qingshigao/201.json:s4104': 'On the guiyou day of the fifth month, Bulantai was transferred; Wang Guodong was Governor of Hunan.',
  'data/qingshigao/201.json:s4105': 'On the guiyou day of the fifth month, Ma Huibo was transferred; Xiande was Governor of Sichuan.',
  'data/qingshigao/201.json:s4106': 'On the guihai day of the second month, Yang Wenqian went on leave, and Changlai served as acting Governor of Guangdong. On the guiyou day of the seventh month, Akedun served in an acting capacity. On the bingyin day of the ninth month, he was transferred; on the renshen day, Shiliha served in an acting capacity.',
  'data/qingshigao/201.json:s4107': 'On the wuyin day of the second month, Han Liangfu filled the vacancy as Governor of Guangxi. On the bingyin day of the ninth month, he was dismissed and Akedun served in an acting capacity. On the gengchen day of the eleventh month, Zu Binggui replaced him.',
  'data/qingshigao/201.json:s4108': 'On the yihai day of the second month, Yang Mingshi was dismissed; Zhu Gang was Governor of Yunnan.',
  'data/qingshigao/201.json:s4109': 'On the jichou day of the tenth month, He Shiqi came to court; Zu Binggui served as acting Governor of Guizhou. On the gengchen day of the eleventh month, he was transferred and replaced.',
  'data/qingshigao/201.json:s4142': 'On the renshen day of the fifth month, he was dismissed while serving as acting Governor of Jiangsu. On the jiashen day of the eighth month, he was transferred, and Yin Jishan served in an acting capacity.',
  'data/qingshigao/201.json:s4144': 'On the jichou day of the sixth month, Wei Tingzhen and Selengge were transferred; Yue Jun served as acting Governor of Shandong.',
  'data/qingshigao/201.json:s4147': 'On the gengzi day of the twelfth month, Jueluo Shilin, Tian Wenjing, and Xilin were dismissed; Zhang Tingdong served as acting Governor of Shaanxi.',
  'data/qingshigao/201.json:s4148': 'On the yiwei day of the eighth month, Mangguli was dismissed; Liu Shiming was Governor of Gansu. On the renchen day of the tenth month, he was transferred, and Xu Rong replaced him.',
  'data/qingshigao/201.json:s4149': 'On the renxu day of the first month, Changlai was transferred, and Zhu Gang was Governor of Fujian. Zhu soon died. On the renchen day of the tenth month, Liu Shiming replaced him.',
  'data/qingshigao/201.json:s4151': 'On the jiashen day of the eighth month, Li Wei and Bulantai were summoned; Zhang Tanlin served as acting Governor of Jiangxi.',
  'data/qingshigao/201.json:s4155': 'On the yiyou day of the eighth month, after Ma Huibo, Wang Guodong, Xiande, and Shiliha, Futai served as acting Governor of Guangdong.',
  'data/qingshigao/201.json:s4156': 'On the guichou day of the fifth month, after Zu Binggui, Jin Hong was Governor of Guangxi.',
  'data/qingshigao/201.json:s4157': 'On the renxu day of the first month, Zhu Gang was transferred; Changlai was Governor of Yunnan. On the guisi day of the sixth month, he was dismissed and replaced.',
  'data/qingshigao/201.json:s4191': 'On the dingchou day of the second month, he filled the vacancy as Governor of Jiangsu. Wang Ji and Peng Weixin served in an acting capacity. In the seventh month, he was dismissed while acting.',
  'data/qingshigao/201.json:s4193': 'On the guisi day of the fourth month, Wei Tingzhen and Yue Jun went on leave. Fei Jinwu served as acting Governor of Shandong. On the jiayin day of the twelfth month, Yue Jun filled the vacancy.',
  'data/qingshigao/201.json:s4196': 'On the wuyin day of the second month, after Jueluo Shilin, Tian Wenjing, and Zhang Tingdong, Wuge was Governor of Shaanxi.',
  'data/qingshigao/201.json:s4199': 'On the bingyin day of the third month, Xu Rong, Liu Shiming, and Li Wei came to court; Cai Shishan served as acting Governor of Zhejiang.',
  'data/qingshigao/201.json:s4200': 'On the jiaxu day of the intercalary seventh month, Zhang Tanlin came to the capital; Xie Min served as acting Governor of Jiangxi.',
  'data/qingshigao/201.json:s4201': 'On the renyin day of the fourth month, Ma Huibo was sent on assignment; Zhao Hong\'en served as acting Governor of Hubei. On the bingzi day of the eleventh month, he was transferred and replaced.'
}));

const contentOverrides = new Map(Object.entries({
  'data/qingshigao/201.json:s2187': {
    from: '\u5f88\u96e3\u5de1\u64ab',
    to: '\u6cb3\u5357\u5de1\u64ab'
  }
}));

const files = new Set([...translations.keys()].map((key) => key.split(':')[0]));
const seen = new Set();

function visit(node, file) {
  if (Array.isArray(node)) {
    for (const child of node) visit(child, file);
    return;
  }

  if (!node || typeof node !== 'object') return;

  if (typeof node.id === 'string') {
    const key = `${file}:${node.id}`;
    const text = translations.get(key);
    if (text) {
      const translation = node.translations?.[0];
      if (!translation) {
        throw new Error(`Missing translation object for ${key}`);
      }
      translation.literal = text;
      translation.idiomatic = text;
      delete translation.allowChineseCharacters;
      node.literal = text;
      node.idiomatic = text;
      node.translation = text;
      delete node.allowChineseCharacters;
      seen.add(key);
    }

    const override = contentOverrides.get(key);
    if (override) {
      if (typeof node.content !== 'string' || !node.content.includes(override.from)) {
        throw new Error(`Content override did not match ${key}`);
      }
      node.content = node.content.replace(override.from, override.to);
    }
  }

  for (const child of Object.values(node)) visit(child, file);
}

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  visit(data, file);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

const missing = [...translations.keys()].filter((key) => !seen.has(key));
if (missing.length) {
  throw new Error(`Unused translation mappings:\n${missing.join('\n')}`);
}

console.log(`Polished ${seen.size} Qing table translations.`);
