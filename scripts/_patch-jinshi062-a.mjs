#!/usr/bin/env node
/** One-off patch: jinshi 062 batch A — Mingchang through Taihe year 1 (s0002–s0052) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0002: {
    literal: 'Song',
    idiomatic: 'Song',
  },
  s0003: {
    literal: 'Xia',
    idiomatic: 'Western Xia',
  },
  s0004: {
    literal: 'Goryeo',
    idiomatic: 'Goryeo',
  },
  s0005: {
    literal: 'First year of the Mingchang era of Emperor Zhangzong',
    idiomatic: 'First year of the Mingchang reign of Emperor Zhangzong',
  },
  s0006: {
    literal:
      'On the first day of the first month, the day bingchen, Song Acting Minister of Revenue Guo Delin and Yizhou Observation Commissioner Cai Xi congratulated the New Year. On the day jisi of the seventh month, Minister of Rites Wang Xiao and others were dispatched as birthday envoys to Song. On the day you of the eighth month, Song Academician of the Xianmo Pavilion Qiu Chun and Fuzhou Observation Commissioner Cai Bisheng congratulated the Heavenly Longevity Festival. On the day yimao of the eleventh month, Deputy Commissioner of the Bureau of Military Affairs Ba Degu and others were dispatched as New Year envoys to Song.',
    idiomatic:
      'On bingchen, the first day of the first month, Acting Minister of Revenue Guo Delin and Yizhou Observation Commissioner Cai Xi of Song came for the New Year. On jisi day in the seventh month Minister of Rites Wang Xiao and others were dispatched as birthday envoys to Song. On you day in the eighth month Academician of the Xianmo Pavilion Qiu Chun and Fuzhou Observation Commissioner Cai Bisheng of Song came for the Heavenly Longevity Festival. On yimao day in the eleventh month Deputy Commissioner of the Bureau of Military Affairs Ba Degu and others were dispatched as New Year envoys to Song.',
  },
  s0007: {
    literal:
      'On the first day of the first month, the day bingchen, Western Xia Military Integrity Grand Master Tang Yanchao and Virtue-Proclaiming Gentleman Yang Yanzhi congratulated the New Year. On the day you of the eighth month, Western Xia Military Integrity Grand Master Zhuaishui Shoujie and Virtue-Proclaiming Gentleman Zhang Zhongwen congratulated the Heavenly Longevity Festival; Prefect of Zhongxing Fu Wang Jinzhong thanked them for the sideways grant.',
    idiomatic:
      'On bingchen, the first day of the first month, Western Xia Military Integrity Grand Master Tang Yanchao and Virtue-Proclaiming Gentleman Yang Yanzhi came for the New Year. On you day in the eighth month Military Integrity Grand Master Zhuaishui Shoujie and Virtue-Proclaiming Gentleman Zhang Zhongwen came for the Heavenly Longevity Festival, and Prefect of Zhongxing Wang Jinzhong thanked the court for the sideways grant.',
  },
  s0008: {
    literal:
      'On the day you of the eighth month, Goryeo Vice Minister of Revenue Chen Kexiu and tribute envoy Minister of Revenue Zheng Shizong congratulated the Heavenly Longevity Festival. On the day dingwei of the twelfth month, Goryeo Vice Minister of Revenue Lu Shi thanked them for the birthday gift.',
    idiomatic:
      'On you day in the eighth month Goryeo Vice Minister of Revenue Chen Kexiu and tribute envoy Minister of Revenue Zheng Shizong came for the Heavenly Longevity Festival. On dingwei day in the twelfth month Vice Minister of Revenue Lu Shi thanked the court for the birthday gift.',
  },
  s0009: {
    literal: 'Second year',
    idiomatic: 'Second year',
  },
  s0010: {
    literal:
      'On the first day of the first month, the day gengxu, Song Acting Minister of Personnel Su Shan and Tanzhou Observation Commissioner Liu Xun congratulated the New Year. On the day bingyin, Left Deputy Director of Palace Inspection Wanyan Yin and others were sent to Song to announce mourning. On the day dingchou of the third month, Song dispatched Acting Minister of Rites Song Zhiduan and Yanzhou Observation Commissioner Song Sizu as condolence and sacrificial envoys for the empress dowager; Vice Director of the Court of Imperial Sacrifices Wang Shujian read the sacrificial text. On the day jisi of the seventh month, Co-signatory of the Grand Peace and Kinship Office Wanyan Yan and others were dispatched as birthday envoys to Song. On the day yisi of the eighth month, Song Acting Minister of Revenue Zhao Yin and Wuzhou Observation Commissioner Tian Gao congratulated the Heavenly Longevity Festival. On the day dinghai of the eleventh month, Tutor to the Prince of Bin Wanyan Zongbi and others were dispatched as New Year envoys to Song.',
    idiomatic:
      'On gengxu, the first day of the first month, Acting Minister of Personnel Su Shan and Tanzhou Observation Commissioner Liu Xun of Song came for the New Year. On bingyin day Left Deputy Director of Palace Inspection Wanyan Yin and others were sent to announce mourning to Song. On dingchou day in the third month Song dispatched Acting Minister of Rites Song Zhiduan and Yanzhou Observation Commissioner Song Sizu as condolence envoys for the empress dowager, with Vice Director of the Court of Imperial Sacrifices Wang Shujian reading the sacrificial text. On jisi day in the seventh month Co-signatory of the Grand Peace and Kinship Office Wanyan Yan and others were dispatched as birthday envoys to Song. On yisi day in the eighth month Acting Minister of Revenue Zhao Yin and Wuzhou Observation Commissioner Tian Gao of Song came for the Heavenly Longevity Festival. On dinghai day in the eleventh month Tutor to the Prince of Bin Wanyan Zongbi and others were dispatched as New Year envoys to Song.',
  },
  s0011: {
    literal:
      'On the first day of the first month, the day gengxu, Western Xia Military Integrity Grand Master Wang Quanzhong and Virtue-Proclaiming Gentleman Zhang Siyi congratulated the New Year. Envoys were permitted to trade for three days. On the day dingsi of the third month, Western Xia Senior General of the Left Jinwu Guard Li Yuanying and Vice Censor-in-Chief Gao Junying came as consolation envoys. On the day dingmao, Western Xia tribute envoy Prefect of Zhongxing Fu Li Siqing and Academician Direct Attendant of the Bureau of Military Affairs Yongchang presented funeral offerings for the empress dowager. On the day yisi of the eighth month, Western Xia Military Integrity Grand Master Shupowei Ying and Virtue-Proclaiming Gentleman Jiao Yuanchang congratulated the Heavenly Longevity Festival.',
    idiomatic:
      'On gengxu, the first day of the first month, Western Xia Military Integrity Grand Master Wang Quanzhong and Virtue-Proclaiming Gentleman Zhang Siyi came for the New Year; the envoys were permitted to trade for three days. On dingsi day in the third month Senior General of the Left Jinwu Guard Li Yuanying and Vice Censor-in-Chief Gao Junying came to offer consolation. On dingmao day tribute envoy Prefect of Zhongxing Li Siqing and Academician Direct Attendant of the Bureau of Military Affairs Yongchang presented funeral offerings for the empress dowager. On yisi day in the eighth month Military Integrity Grand Master Shupowei Ying and Virtue-Proclaiming Gentleman Jiao Yuanchang came for the Heavenly Longevity Festival.',
  },
  s0012: {
    literal:
      'On the first day of the first month, the day gengxu, Goryeo Minor Official of Guests Zheng Kewen congratulated the New Year. On the day yihai of the third month, Goryeo Acting Vice Director of the Right Secretariat and Minister of Works Han Zhengxiu and Vice Minister of Personnel Cui Dunli came to offer consolation; Acting Junior Director of the Secretariat Mun Wendeupin and Vice Minister of Rites Li Shichang offered sacrificial condolences. On the day yisi of the eighth month, Goryeo Vice Minister of Revenue Liu Guangshou came to congratulate the Heavenly Longevity Festival, and Vice Minister of Revenue Song Hongdi presented tribute. On the day guimao of the twelfth month, Goryeo Vice Minister of Revenue Li Zhichun thanked them for the birthday gift.',
    idiomatic:
      'On gengxu, the first day of the first month, Goryeo Minor Official of Guests Zheng Kewen came for the New Year. On yihai day in the third month Acting Vice Director of the Right Secretariat and Minister of Works Han Zhengxiu and Vice Minister of Personnel Cui Dunli came to offer consolation, while Acting Junior Director of the Secretariat Mun Wendeupin and Vice Minister of Rites Li Shichang presented sacrificial condolences. On yisi day in the eighth month Vice Minister of Revenue Liu Guangshou came for the Heavenly Longevity Festival and Vice Minister of Revenue Song Hongdi presented tribute. On guimao day in the twelfth month Vice Minister of Revenue Li Zhichun thanked the court for the birthday gift.',
  },
  s0013: {
    literal: 'Third year',
    idiomatic: 'Third year',
  },
  s0014: {
    literal:
      'On the first day of the first month, the day yisi, Song Academician of the Huanzhang Pavilion Huang Shen and Mingzhou Observation Commissioner Zhang Zongyi congratulated the New Year. On the day xinmao of the seventh month, Director of Palace Inspection Pusan Duan and others were dispatched as birthday envoys to Song. In the eighth month, Song Minister of Works Qian Zhiwang and Guangzhou Observation Commissioner Yang Dajie congratulated the Heavenly Longevity Festival. On the day wuyin of the eleventh month, Right Deputy Director of Palace Inspection Wendun Zhong and others were dispatched as New Year envoys to Song.',
    idiomatic:
      'On yisi, the first day of the first month, Academician of the Huanzhang Pavilion Huang Shen and Mingzhou Observation Commissioner Zhang Zongyi of Song came for the New Year. On xinmao day in the seventh month Director of Palace Inspection Pusan Duan and others were dispatched as birthday envoys to Song. In the eighth month Minister of Works Qian Zhiwang and Guangzhou Observation Commissioner Yang Dajie of Song came for the Heavenly Longevity Festival. On wuyin day in the eleventh month Right Deputy Director of Palace Inspection Wendun Zhong and others were dispatched as New Year envoys to Song.',
  },
  s0015: {
    literal:
      'On the first day of the first month, the day yisi, Western Xia Military Integrity Grand Master Zhao Hao and Virtue-Proclaiming Gentleman Shi Congli congratulated the New Year. On the day dingmao of the eighth month, Western Xia Military Integrity Grand Master Wang Dunxin and Virtue-Proclaiming Gentleman Han Borong congratulated the Heavenly Longevity Festival.',
    idiomatic:
      'On yisi, the first day of the first month, Western Xia Military Integrity Grand Master Zhao Hao and Virtue-Proclaiming Gentleman Shi Congli came for the New Year. On dingmao day in the eighth month Military Integrity Grand Master Wang Dunxin and Virtue-Proclaiming Gentleman Han Borong came for the Heavenly Longevity Festival.',
  },
  s0016: {
    literal:
      'On the first day of the first month, the day yisi, Goryeo Minor Official of Guests Hong Xiaozhong congratulated the New Year. On the day dingmao of the eighth month, Goryeo Vice Director of the Court of Imperial Regalia Piao Chu congratulated the Heavenly Longevity Festival; Junior Director of the Secretariat Shi Wei thanked them for the sideways grant, and Minor Official of Guests Shi Chengzu presented tribute. On the day dingmao of the twelfth month, Goryeo dispatched Vice Minister of Revenue Ding Guangxu to thank them for the birthday gift.',
    idiomatic:
      'On yisi, the first day of the first month, Goryeo Minor Official of Guests Hong Xiaozhong came for the New Year. On dingmao day in the eighth month Vice Director of the Court of Imperial Regalia Piao Chu came for the Heavenly Longevity Festival; Junior Director of the Secretariat Shi Wei thanked the court for the sideways grant and Minor Official of Guests Shi Chengzu presented tribute. On dingmao day in the twelfth month Goryeo dispatched Vice Minister of Revenue Ding Guangxu to thank the court for the birthday gift.',
  },
  s0017: {
    literal: 'Fourth year',
    idiomatic: 'Fourth year',
  },
  s0018: {
    literal:
      'On the first day of the first month, the day jisi, Song Academician of the Xianmo Pavilion Zheng Runie and Junzhou Observation Commissioner Qiao Lingyong congratulated the New Year. On the day jichou of the seventh month, Vice Censor-in-Chief Dong Shizhong and others were dispatched as birthday envoys to Song. On the day xinyou of the eighth month, Song Minister of Personnel Xu Jizhi and Mingzhou Observation Commissioner Jiang Jie congratulated the Heavenly Longevity Festival. On the day wuyin of the eleventh month, Hanlin Academician Direct Attendant Wanyan Kuang changed his name to Bi and was dispatched as New Year envoy to Song.',
    idiomatic:
      'On jisi, the first day of the first month, Academician of the Xianmo Pavilion Zheng Runie and Junzhou Observation Commissioner Qiao Lingyong of Song came for the New Year. On jichou day in the seventh month Vice Censor-in-Chief Dong Shizhong and others were dispatched as birthday envoys to Song. On xinyou day in the eighth month Minister of Personnel Xu Jizhi and Mingzhou Observation Commissioner Jiang Jie of Song came for the Heavenly Longevity Festival. On wuyin day in the eleventh month Hanlin Academician Direct Attendant Wanyan Kuang changed his name to Bi and was dispatched as New Year envoy to Song.',
  },
  s0019: {
    literal:
      'On the first day of the first month, the day jisi, Western Xia Military Integrity Grand Master Wu Suiliang and Virtue-Proclaiming Gentleman Gao Chongde congratulated the New Year. On the day xinyou of the eighth month, Western Xia Military Integrity Grand Master Pang Jingshide and Virtue-Proclaiming Gentleman Zhang Chongshi congratulated the Heavenly Longevity Festival; Vice Censor-in-Chief Nai Lingsicong thanked them for the sideways grant. In the ninth month Renxiao died, and his son Chunyou succeeded. On the day renshen of the eleventh month, Western Xia Censor-in-Chief Li Yuanji and Hanlin Academician Li Guo’an came to announce the death. On the first day of the twelfth month, the day jiawu, Western Xia Palace Attendant Taiwei Mieming Youzhi and Deputy Envoy Academician Direct Attendant of the Bureau of Military Affairs Li Changfu presented the deceased’s bequest gifts.',
    idiomatic:
      'On jisi, the first day of the first month, Western Xia Military Integrity Grand Master Wu Suiliang and Virtue-Proclaiming Gentleman Gao Chongde came for the New Year. On xinyou day in the eighth month Military Integrity Grand Master Pang Jingshide and Virtue-Proclaiming Gentleman Zhang Chongshi came for the Heavenly Longevity Festival, and Vice Censor-in-Chief Nai Lingsicong thanked the court for the sideways grant. In the ninth month Emperor Renxiao died and his son Chunyou succeeded. On renshen day in the eleventh month Censor-in-Chief Li Yuanji and Hanlin Academician Li Guo’an of Western Xia came to announce the death. On jiawu, the first day of the twelfth month, Palace Attendant Taiwei Mieming Youzhi and Deputy Envoy Academician Direct Attendant Li Changfu presented the deceased’s bequest gifts.',
  },
  s0020: {
    literal:
      'On the first day of the first month, the day jisi, Goryeo Vice Director of the Directorate of Palace Provisions Yang Shujie congratulated the New Year. On the day xinyou of the eighth month, Goryeo Minor Official of Guests Su Liangmei congratulated the Heavenly Longevity Festival, and Vice Minister of Personnel Mun Houzhi presented tribute. On the day gengshen of the twelfth month, Goryeo Vice Minister of Revenue Chen Guangqing and others thanked them for the birthday gift.',
    idiomatic:
      'On jisi, the first day of the first month, Goryeo Vice Director of the Directorate of Palace Provisions Yang Shujie came for the New Year. On xinyou day in the eighth month Minor Official of Guests Su Liangmei came for the Heavenly Longevity Festival and Vice Minister of Personnel Mun Houzhi presented tribute. On gengshen day in the twelfth month Vice Minister of Revenue Chen Guangqing and others thanked the court for the birthday gift.',
  },
  s0021: {
    literal: 'Fifth year',
    idiomatic: 'Fifth year',
  },
  s0022: {
    literal:
      'On the first day of the first month, the day guihai, Song Hanlin Academician Ni Si and Commissioner of the Office of the Inner Gates Wang Zhixin congratulated the New Year. On the day wuxu of the sixth month, the former Song ruler Shen died. On the day jiazi of the seventh month, the Song ruler abdicated in favor of his son Kuo. On the day yimao of the eighth month, Song Acting Minister of Works Liang Zong and Mingzhou Observation Commissioner Dai Xun congratulated the Heavenly Longevity Festival. On the day renshen of the ninth month, Song Academician of the Xianmo Pavilion Xue Shusi and Guangzhou Observation Commissioner Xie Yuan came to announce mourning. On the day wuyin, Commissioner of the Daxing Prefecture Nimogujian was appointed condolence and sacrificial envoy to Song. On the day gengyin of the tenth month, Song Minister of Revenue Lin Shi and Quanzhou Observation Commissioner You Gong presented bequest gifts. On the first day of the intercalary tenth month, the day wuwu, Song Hanlin Academician Zheng Shi and Guangzhou Observation Commissioner Fan Zhongren reported the accession. On the day jiaxu, Eastern and Western Hedong Circuit Investigation Commissioner Wang Qi and Broad Might General Left Deputy Director of Palace Inspection Shimoh Zhongwen were appointed credentialed envoys to congratulate the Song accession. On the day gengzi of the eleventh month, Broad Might General Right Commissioner of the Palace Secretariat Yela Min and Shandong Eastern Circuit Transport Commissioner Gao Shizhong were appointed New Year envoys to Song.',
    idiomatic:
      'On guihai, the first day of the first month, Hanlin Academician Ni Si and Commissioner of the Office of the Inner Gates Wang Zhixin of Song came for the New Year. On wuxu day in the sixth month the former Song emperor Shen died. On jiazi day in the seventh month the Song emperor abdicated in favor of his son Kuo. On yimao day in the eighth month Acting Minister of Works Liang Zong and Mingzhou Observation Commissioner Dai Xun of Song came for the Heavenly Longevity Festival. On renshen day in the ninth month Academician of the Xianmo Pavilion Xue Shusi and Guangzhou Observation Commissioner Xie Yuan came to announce mourning. On wuyin day Commissioner of Daxing Prefecture Nimogujian was appointed condolence envoy to Song. On gengyin day in the tenth month Minister of Revenue Lin Shi and Quanzhou Observation Commissioner You Gong presented bequest gifts. On wuwu, the first day of the intercalary tenth month, Hanlin Academician Zheng Shi and Guangzhou Observation Commissioner Fan Zhongren reported the accession. On jiaxu day Eastern and Western Hedong Circuit Investigation Commissioner Wang Qi and Broad Might General Left Deputy Director of Palace Inspection Shimoh Zhongwen were appointed credentialed envoys to congratulate the Song accession. On gengzi day in the eleventh month Broad Might General Right Commissioner of the Palace Secretariat Yela Min and Shandong Eastern Circuit Transport Commissioner Gao Shizhong were appointed New Year envoys to Song.',
  },
  s0023: {
    literal:
      'On the first day of the first month, the day guihai, Western Xia Military Integrity Grand Master Nu’enu Shizhong and Virtue-Proclaiming Gentleman Liu Siwen and others congratulated the New Year. On the day xinsi, Central Integrity Grand Master Libationer of the Directorate of Education Liu Ji and Right Bureau Director of the Secretariat Wugulun Qingyi and others were appointed investiture and mourning-resumption envoys to enfeoff Western Xia King Li Chunyou. On the day renyin of the fourth month, Western Xia Vice Censor-in-Chief Lang’e Wenguang, Deputy Envoy Academician Direct Attendant Liu Juncai, and Escort Commissioner Prefect of Zhongxing Yeyu Kezhong came to report thanks. On the day yimao of the eighth month, Western Xia Military Integrity Grand Master Yeyu Siwen and Virtue-Proclaiming Gentleman Zhang Gongfu congratulated the Heavenly Longevity Festival.',
    idiomatic:
      'On guihai, the first day of the first month, Western Xia Military Integrity Grand Master Nu’enu Shizhong and Virtue-Proclaiming Gentleman Liu Siwen and others came for the New Year. On xinsi day Central Integrity Grand Master Libationer of the Directorate of Education Liu Ji and Right Bureau Director of the Secretariat Wugulun Qingyi and others were appointed investiture envoys to enfeoff Western Xia King Li Chunyou upon his resumption from mourning. On renyin day in the fourth month Vice Censor-in-Chief Lang’e Wenguang, Deputy Envoy Academician Direct Attendant Liu Juncai, and Escort Commissioner Prefect of Zhongxing Yeyu Kezhong came to report thanks. On yimao day in the eighth month Military Integrity Grand Master Yeyu Siwen and Virtue-Proclaiming Gentleman Zhang Gongfu came for the Heavenly Longevity Festival.',
  },
  s0024: {
    literal:
      'On the first day of the first month, the day guihai, Goryeo Vice Director of the Court of Imperial Regalia Li Juzheng congratulated the New Year. On the first day of the eighth month, the day jichou, Goryeo Minor Official of Guests Quan Xin congratulated the Heavenly Longevity Festival, and Vice Director of the Court of the Imperial Treasury Liu Ze presented tribute. On the first day of the twelfth month, the day dingsi, Goryeo Vice Minister of Revenue Liu Bangdi thanked them for the birthday gift.',
    idiomatic:
      'On guihai, the first day of the first month, Goryeo Vice Director of the Court of Imperial Regalia Li Juzheng came for the New Year. On jichou, the first day of the eighth month, Minor Official of Guests Quan Xin came for the Heavenly Longevity Festival and Vice Director of the Court of the Imperial Treasury Liu Ze presented tribute. On dingsi, the first day of the twelfth month, Vice Minister of Revenue Liu Bangdi thanked the court for the birthday gift.',
  },
  s0025: {
    literal: 'Sixth year',
    idiomatic: 'Sixth year',
  },
  s0026: {
    literal:
      'On the first day of the first month, the day dinghai, Song Acting Minister of Rites Zeng Sanfu congratulated the New Year. On the day guiwei of the second month, Song Academician of the Huanzhang Pavilion Lin Jiyou and Mingzhou Observation Commissioner Guo Zhengji came to report thanks. On the day xinwei of the eighth month, Minister of Personnel Wu Dingshu and others were dispatched as birthday envoys to Song. On the day jimao, Song Acting Minister of Personnel Wang Yiduan and Fuzhou Observation Commissioner Han Tuozhou congratulated the Heavenly Longevity Festival. On the day bingshen of the eleventh month, Minister of Justice Heshilie Zhen and others were dispatched as New Year envoys to Song.',
    idiomatic:
      'On dinghai, the first day of the first month, Acting Minister of Rites Zeng Sanfu of Song came for the New Year. On guiwei day in the second month Academician of the Huanzhang Pavilion Lin Jiyou and Mingzhou Observation Commissioner Guo Zhengji of Song came to report thanks. On xinwei day in the eighth month Minister of Personnel Wu Dingshu and others were dispatched as birthday envoys to Song. On jimao day Acting Minister of Personnel Wang Yiduan and Fuzhou Observation Commissioner Han Tuozhou of Song came for the Heavenly Longevity Festival. On bingshen day in the eleventh month Minister of Justice Heshilie Zhen and others were dispatched as New Year envoys to Song.',
  },
  s0027: {
    literal:
      'On the first day of the first month, the day dinghai, Western Xia Military Integrity Grand Master Wang Yancai and Virtue-Proclaiming Gentleman Gao Dajie congratulated the New Year. On the day bingshen of the third month, Western Xia Censor-in-Chief Li Yanchong and Commissioner of Zhongxing Fu Hao Tingjun thanked them for the birthday gift. On the day jimao of the eighth month, Western Xia Military Integrity Grand Master Song Kezhong and Virtue-Proclaiming Gentleman Wu Zizheng congratulated the Heavenly Longevity Festival.',
    idiomatic:
      'On dinghai, the first day of the first month, Western Xia Military Integrity Grand Master Wang Yancai and Virtue-Proclaiming Gentleman Gao Dajie came for the New Year. On bingshen day in the third month Censor-in-Chief Li Yanchong and Commissioner of Zhongxing Hao Tingjun thanked the court for the birthday gift. On jimao day in the eighth month Military Integrity Grand Master Song Kezhong and Virtue-Proclaiming Gentleman Wu Zizheng came for the Heavenly Longevity Festival.',
  },
  s0028: {
    literal:
      'On the first day of the first month, the day dinghai, Goryeo Vice Minister of Revenue Bai Cunru congratulated the New Year. On the day jimao of the eighth month, Goryeo Vice Minister of Rites Xu Xie congratulated the Heavenly Longevity Festival, and Vice Director of the Court of Imperial Regalia Zhou Yuandi thanked them for the sideways grant. On the day dingchou of the twelfth month, Goryeo Vice Minister of Revenue Sun Hong thanked them for the birthday gift.',
    idiomatic:
      'On dinghai, the first day of the first month, Goryeo Vice Minister of Revenue Bai Cunru came for the New Year. On jimao day in the eighth month Vice Minister of Rites Xu Xie came for the Heavenly Longevity Festival and Vice Director of the Court of Imperial Regalia Zhou Yuandi thanked the court for the sideways grant. On dingchou day in the twelfth month Vice Minister of Revenue Sun Hong thanked the court for the birthday gift.',
  },
  s0029: {
    literal: 'First year of the Cheng’an era',
    idiomatic: 'First year of the Cheng’an reign',
  },
  s0030: {
    literal:
      'On the first day of the first month, the day xinsi, Song dispatched Hanlin Academician Huang Ai and Junzhou Observation Commissioner Liu Zhengyi to congratulate the New Year. On the day jiaxu of the eighth month, Song Acting Minister of Works Wu Zongdan and Huzhou Observation Commissioner Zhang Zhuo congratulated the Heavenly Longevity Festival. On the day guimao of the ninth month, Minister of Personnel Zhang Si and others were dispatched as birthday envoys to Song. On the day jiawu of the eleventh month, Shaanxi Circuit Pacification Commissioner Wanyan Chongdao and others were dispatched as New Year envoys to Song.',
    idiomatic:
      'On xinsi, the first day of the first month, Hanlin Academician Huang Ai and Junzhou Observation Commissioner Liu Zhengyi were dispatched from Song to congratulate the New Year. On jiaxu day in the eighth month Acting Minister of Works Wu Zongdan and Huzhou Observation Commissioner Zhang Zhuo of Song came for the Heavenly Longevity Festival. On guimao day in the ninth month Minister of Personnel Zhang Si and others were dispatched as birthday envoys to Song. On jiawu day in the eleventh month Shaanxi Circuit Pacification Commissioner Wanyan Chongdao and others were dispatched as New Year envoys to Song.',
  },
  s0031: {
    literal:
      'On the first day of the first month, the day xinsi, Western Xia Military Integrity Grand Master Yuan Yuanheng and Virtue-Proclaiming Gentleman Yuan Shu and others congratulated the New Year. On the day jiaxu of the eighth month, Western Xia Military Integrity Grand Master Tong Chongyi and Virtue-Proclaiming Gentleman Lü Changbang congratulated the Heavenly Longevity Festival.',
    idiomatic:
      'On xinsi, the first day of the first month, Western Xia Military Integrity Grand Master Yuan Yuanheng and Virtue-Proclaiming Gentleman Yuan Shu and others came for the New Year. On jiaxu day in the eighth month Military Integrity Grand Master Tong Chongyi and Virtue-Proclaiming Gentleman Lü Changbang came for the Heavenly Longevity Festival.',
  },
  s0032: {
    literal:
      'On the first day of the first month, the day xinsi, Goryeo Minor Official of Guests Song Wei congratulated the New Year. On the day jiaxu of the eighth month, Goryeo Vice Minister of Rites Zhao Chong congratulated the Heavenly Longevity Festival, and Director of the Court of the Imperial Treasury Liu Yingju presented tribute. On the first day of the twelfth month, the day bingwu, Goryeo Vice Minister of Revenue Jin Guangdang thanked them for the birthday gift.',
    idiomatic:
      'On xinsi, the first day of the first month, Goryeo Minor Official of Guests Song Wei came for the New Year. On jiaxu day in the eighth month Vice Minister of Rites Zhao Chong came for the Heavenly Longevity Festival and Director of the Court of the Imperial Treasury Liu Yingju presented tribute. On bingwu, the first day of the twelfth month, Vice Minister of Revenue Jin Guangdang thanked the court for the birthday gift.',
  },
  s0033: {
    literal: 'Second year',
    idiomatic: 'Second year',
  },
  s0034: {
    literal:
      'On the first day of the first month, the day yihai, Song Academician of the Huanzhang Pavilion Zhang Guimou and Yanzhou Observation Commissioner Guo Ni congratulated the New Year. On the day xinchou, Song Acting Minister of Rites Zhao Jie and Lizhou Observation Commissioner Zhu Guinian came to announce mourning for their mother. On the day wuxu of the eighth month, Song Acting Minister of Works Wei Jing and Quanzhou Observation Commissioner Chen Yi congratulated the Heavenly Longevity Festival. On the day dingwei of the ninth month, Commissioner of Guide Prefecture Wanyan Yu and others were dispatched as birthday envoys to Song.',
    idiomatic:
      'On yihai, the first day of the first month, Academician of the Huanzhang Pavilion Zhang Guimou and Yanzhou Observation Commissioner Guo Ni of Song came for the New Year. On xinchou day Acting Minister of Rites Zhao Jie and Lizhou Observation Commissioner Zhu Guinian of Song came to announce mourning for their mother. On wuxu day in the eighth month Acting Minister of Works Wei Jing and Quanzhou Observation Commissioner Chen Yi of Song came for the Heavenly Longevity Festival. On dingwei day in the ninth month Commissioner of Guide Prefecture Wanyan Yu and others were dispatched as birthday envoys to Song.',
  },
  s0035: {
    literal:
      'On the first day of the first month, the day yihai, Western Xia Military Integrity Grand Master Weiqi Shian and Virtue-Proclaiming Gentleman Li Shiguang congratulated the New Year. On the day wuxu of the eighth month, Western Xia Military Integrity Grand Master Luoshi Shouzhong and Virtue-Proclaiming Gentleman Wang Yanguo congratulated the Heavenly Longevity Festival. Commissioner of Zhongxing Fu Li Dechong, Academician Direct Attendant Liu Siwen, and others memorialized regarding the border markets. On the day dingyou of the twelfth month, Western Xia Palace Attendant Taiwei Li Siqing and Commissioner of Zhongxing Fu Gao Dechong thanked them for the restoration of the border markets.',
    idiomatic:
      'On yihai, the first day of the first month, Western Xia Military Integrity Grand Master Weiqi Shian and Virtue-Proclaiming Gentleman Li Shiguang came for the New Year. On wuxu day in the eighth month Military Integrity Grand Master Luoshi Shouzhong and Virtue-Proclaiming Gentleman Wang Yanguo came for the Heavenly Longevity Festival. Commissioner of Zhongxing Li Dechong, Academician Direct Attendant Liu Siwen, and others memorialized regarding the border markets. On dingyou day in the twelfth month Palace Attendant Taiwei Li Siqing and Commissioner of Zhongxing Gao Dechong thanked the court for restoring the border markets.',
  },
  s0036: {
    literal:
      'On the first day of the first month, the day yihai, Goryeo Minor Official of Guests Ya Yingqing congratulated the New Year. On the day wuxu of the eighth month, Goryeo Vice Minister of Rites Zhao Qian congratulated the Heavenly Longevity Festival, and Vice Minister of Revenue Liang Yuan presented tribute.',
    idiomatic:
      'On yihai, the first day of the first month, Goryeo Minor Official of Guests Ya Yingqing came for the New Year. On wuxu day in the eighth month Vice Minister of Rites Zhao Qian came for the Heavenly Longevity Festival and Vice Minister of Revenue Liang Yuan presented tribute.',
  },
  s0037: {
    literal: 'Third year',
    idiomatic: 'Third year',
  },
  s0038: {
    literal:
      'On the first day of the first month, the day jihai, Song Academician of the Huanzhang Pavilion Zeng Yan and Ezhou Observation Commissioner Zheng Ting congratulated the New Year. On the day yichou, Song Acting Minister of Rites Zhao Jie and Lizhou Observation Commissioner Zhu Guinian came to announce mourning for the Song empress grandmother. On the day guiwei of the eighth month, Song Acting Minister of Justice Tang Shuo and Fuzhou Observation Commissioner Li Ruyi and others came to report thanks. On the day bingshen of the ninth month, Song Academician of the Xianmo Pavilion Yang Wangxiu and Lizhou Observation Commissioner Li Anli congratulated the Heavenly Longevity Festival. Chief Transport Commissioner of the Central Capital Circuit Sun Duo and others were dispatched as birthday envoys to Song. On the day dingwei of the eleventh month, Director of the Court of Imperial Sacrifices Yang Tingjun and others were dispatched as New Year envoys to Song.',
    idiomatic:
      'On jihai, the first day of the first month, Academician of the Huanzhang Pavilion Zeng Yan and Ezhou Observation Commissioner Zheng Ting of Song came for the New Year. On yichou day Acting Minister of Rites Zhao Jie and Lizhou Observation Commissioner Zhu Guinian of Song came to announce mourning for the Song empress grandmother. On guiwei day in the eighth month Acting Minister of Justice Tang Shuo and Fuzhou Observation Commissioner Li Ruyi and others of Song came to report thanks. On bingshen day in the ninth month Academician of the Xianmo Pavilion Yang Wangxiu and Lizhou Observation Commissioner Li Anli of Song came for the Heavenly Longevity Festival. Chief Transport Commissioner of the Central Capital Circuit Sun Duo and others were dispatched as birthday envoys to Song. On dingwei day in the eleventh month Director of the Court of Imperial Sacrifices Yang Tingjun and others were dispatched as New Year envoys to Song.',
  },
  s0039: {
    literal:
      'On the first day of the first month, the day jihai, Western Xia Military Merit Grand Master Wei Minxiu and Virtue-Proclaiming Gentleman Zhong Boda congratulated the New Year. On the day jiawu of the eighth month, Western Xia Military Integrity Grand Master Zheshi Junyi and Virtue-Proclaiming Gentleman Luo Shichang congratulated the Heavenly Longevity Festival.',
    idiomatic:
      'On jihai, the first day of the first month, Western Xia Military Merit Grand Master Wei Minxiu and Virtue-Proclaiming Gentleman Zhong Boda came for the New Year. On jiawu day in the eighth month Military Integrity Grand Master Zheshi Junyi and Virtue-Proclaiming Gentleman Luo Shichang came for the Heavenly Longevity Festival.',
  },
  s0040: {
    literal:
      'On the day bingyin of the third month, Wang Hao yielded the state to his younger brother Chuo; Minor Official of Guests Zhao Tong came to memorialize and report this, requesting investiture for Chuo. Envoys were dispatched to inquire and announce the court’s will. That year Hao died; Chuo succeeded, and Minor Official of Guests Bai Ruzhou was dispatched to memorialize and report this.',
    idiomatic:
      'On bingyin day in the third month Wang Hao abdicated in favor of his younger brother Chuo; Minor Official of Guests Zhao Tong came to report the transfer and request investiture for Chuo, and the court dispatched envoys to inquire. That year Hao died and Chuo succeeded; Minor Official of Guests Bai Ruzhou was dispatched to report the succession.',
  },
  s0041: {
    literal: 'Fourth year',
    idiomatic: 'Fourth year',
  },
  s0042: {
    literal:
      'On the first day of the first month, the day guisi, Song Minister of Works Ma Jue and Guangzhou Observation Commissioner Zheng Jin congratulated the New Year. On the day jichou of the eighth month, Song Acting Minister of Works Li Daxing and Quanzhou Observation Commissioner Jin Tangjie congratulated the Heavenly Longevity Festival. On the day jiwei of the ninth month, Commissioner of Dongping Prefecture Pusan Qi and others were dispatched as birthday envoys to Song. On the day jiayin of the eleventh month, Commissioner of Jinan Prefecture Fan Ji and others were dispatched as New Year envoys to Song.',
    idiomatic:
      'On guisi, the first day of the first month, Minister of Works Ma Jue and Guangzhou Observation Commissioner Zheng Jin of Song came for the New Year. On jichou day in the eighth month Acting Minister of Works Li Daxing and Quanzhou Observation Commissioner Jin Tangjie of Song came for the Heavenly Longevity Festival. On jiwei day in the ninth month Commissioner of Dongping Prefecture Pusan Qi and others were dispatched as birthday envoys to Song. On jiayin day in the eleventh month Commissioner of Jinan Prefecture Fan Ji and others were dispatched as New Year envoys to Song.',
  },
  s0043: {
    literal:
      'On the first day of the first month, the day guisi, Western Xia Military Integrity Grand Master Li Qingyuan and Virtue-Proclaiming Gentleman Deng Changzu congratulated the New Year. On the day jichou of the eighth month, Western Xia Military Integrity Grand Master Niushang Dechang and Virtue-Proclaiming Gentleman Li Gongda congratulated the Heavenly Longevity Festival. Palace Attendant Taiwei Nai Lingsicong and Academician Direct Attendant Yang Dexian thanked them for the sideways grant.',
    idiomatic:
      'On guisi, the first day of the first month, Western Xia Military Integrity Grand Master Li Qingyuan and Virtue-Proclaiming Gentleman Deng Changzu came for the New Year. On jichou day in the eighth month Military Integrity Grand Master Niushang Dechang and Virtue-Proclaiming Gentleman Li Gongda came for the Heavenly Longevity Festival. Palace Attendant Taiwei Nai Lingsicong and Academician Direct Attendant Yang Dexian thanked the court for the sideways grant.',
  },
  s0044: {
    literal:
      'On the day dingyou of the first month, Goryeo announced mourning. In the third month, envoys were dispatched to invest Wang Chuo as king of Goryeo. On the day jichou of the eighth month, King Chuo of Goryeo dispatched Vice Minister of Revenue Liu Yuanshun to congratulate the Heavenly Longevity Festival, and Vice Minister of Revenue Zheng Bangfu presented tribute. On the day yiyou of the twelfth month, Goryeo Commissioner of the Bureau of Military Affairs Jin Shihou and Director of the Court of the Imperial Treasury Wang Yi thanked them for the investiture patent.',
    idiomatic:
      'On dingyou day in the first month Goryeo announced mourning. In the third month envoys were dispatched to invest Wang Chuo as king of Goryeo. On jichou day in the eighth month King Chuo dispatched Vice Minister of Revenue Liu Yuanshun for the Heavenly Longevity Festival and Vice Minister of Revenue Zheng Bangfu presented tribute. On yiyou day in the twelfth month Commissioner of the Bureau of Military Affairs Jin Shihou and Director of the Court of the Imperial Treasury Wang Yi thanked the court for the investiture patent.',
  },
  s0045: {
    literal: 'Fifth year',
    idiomatic: 'Fifth year',
  },
  s0046: {
    literal:
      'On the first day of the first month, the day wuzi, Song Academician of the Huanzhang Pavilion Zhu Zhizhi and Fuzhou Observation Commissioner Li Shizhi congratulated the New Year. On the day renzi of the eighth month, Song Minister of Revenue Zhao Shanyi and Ezhou Observation Commissioner Li Zhongxiang congratulated the Heavenly Longevity Festival. That same month the former Song ruler Dun died. On the day gengzi of the tenth month, Song Acting Minister of Justice Wu Gan and Lizhou Observation Commissioner Lin Keda came to announce mourning for their mother. On the day jisi of the eleventh month, Song Academician of the Huanzhang Pavilion Li Yinzhong and Fuzhou Observation Commissioner Zhang Liangxian came to announce mourning for the former ruler. On the day yimao, Minister of Works Wugulun Yi and others were dispatched as condolence and sacrificial envoys to Song. On the day xinwei, Right Deputy Director of Palace Inspection Heshilie Zhongding and others were dispatched as New Year envoys to Song. On the day guiwei of the twelfth month, Henan Circuit Pacification Commissioner Wanyan Chong and others were dispatched as condolence and sacrificial envoys to Song.',
    idiomatic:
      'On wuzi, the first day of the first month, Academician of the Huanzhang Pavilion Zhu Zhizhi and Fuzhou Observation Commissioner Li Shizhi of Song came for the New Year. On renzi day in the eighth month Minister of Revenue Zhao Shanyi and Ezhou Observation Commissioner Li Zhongxiang of Song came for the Heavenly Longevity Festival; that same month the former Song emperor Dun died. On gengzi day in the tenth month Acting Minister of Justice Wu Gan and Lizhou Observation Commissioner Lin Keda of Song came to announce mourning for their mother. On jisi day in the eleventh month Academician of the Huanzhang Pavilion Li Yinzhong and Fuzhou Observation Commissioner Zhang Liangxian came to announce mourning for the former emperor. On yimao day Minister of Works Wugulun Yi and others were dispatched as condolence envoys to Song. On xinwei day Right Deputy Director of Palace Inspection Heshilie Zhongding and others were dispatched as New Year envoys to Song. On guiwei day in the twelfth month Henan Circuit Pacification Commissioner Wanyan Chong and others were dispatched as condolence envoys to Song.',
  },
  s0047: {
    literal:
      'On the first day of the first month, the day wuzi, Western Xia Military Integrity Grand Master Liandu Dunxin and Virtue-Proclaiming Gentleman Ding Shizhou congratulated the New Year, appending a memorial requesting physicians because of their mother’s illness. An edict ordered Imperial Physicians Shi Deyuan and Wang Lizhen to go to examine and treat her, and imperial formulary medicines were also bestowed. On the day renzi of the eighth month, Western Xia Military Integrity Grand Master Liandu Dunxin and Virtue-Proclaiming Gentleman Ding Shizhou congratulated the Heavenly Longevity Festival; Southern Court Commissioner of the Palace Secretariat Liu Zhongliang and Prefect of Zhongxing Gao Yongchang came to thank them for the grace.',
    idiomatic:
      'On wuzi, the first day of the first month, Western Xia Military Integrity Grand Master Liandu Dunxin and Virtue-Proclaiming Gentleman Ding Shizhou came for the New Year, appending a memorial to request physicians for their mother’s illness. The court ordered Imperial Physicians Shi Deyuan and Wang Lizhen to examine and treat her and bestowed imperial formulary medicines. On renzi day in the eighth month Military Integrity Grand Master Liandu Dunxin and Virtue-Proclaiming Gentleman Ding Shizhou came for the Heavenly Longevity Festival; Southern Court Commissioner of the Palace Secretariat Liu Zhongliang and Prefect of Zhongxing Gao Yongchang came to thank the court for its grace.',
  },
  s0048: {
    literal:
      'On the first day of the first month, the day wuzi, Goryeo Minor Official of Guests Bai Yuanzhi came to congratulate the New Year. On the day renzi of the eighth month, Goryeo Vice Minister of Revenue Chi Zishen congratulated the Heavenly Longevity Festival, and Vice Minister of Revenue Shen Zhouxi and others presented tribute.',
    idiomatic:
      'On wuzi, the first day of the first month, Goryeo Minor Official of Guests Bai Yuanzhi came for the New Year. On renzi day in the eighth month Vice Minister of Revenue Chi Zishen came for the Heavenly Longevity Festival and Vice Minister of Revenue Shen Zhouxi and others presented tribute.',
  },
  s0049: {
    literal: 'First year of the Taihe era',
    idiomatic: 'First year of the Taihe reign',
  },
  s0050: {
    literal:
      'On the first day of the first month, the day renzi, Song Academician of the Baomo Pavilion Lin Jue and Lizhou Observation Commissioner Wang Kangcheng congratulated the New Year. On the day renxu, Song Acting Minister of Works Ding Changren and Yanzhou Observation Commissioner Guo Tan presented bequest gifts. On the day yihai of the third month, Song Acting Minister of Justice Yu Chou and Quanzhou Observation Commissioner Zhang Zhongshu and others came to report thanks. On the day bingshen of the eighth month, Song Acting Minister of Revenue Yu Lie and Fuzhou Observation Commissioner Li Yan and others came to report thanks. On the day bingshen, Song dispatched Acting Minister of Personnel Chen Zongzhao and Guangzhou Observation Commissioner Dou Kui to congratulate the Heavenly Longevity Festival. On the day wushen of the ninth month, Right Commissioner of the Palace Secretariat Tushan Huaizhong and others were dispatched as birthday envoys to Song. On the day gengshen of the eleventh month, General of the Right Palace Guard Heshilie Qijin and others were dispatched as New Year envoys to Song.',
    idiomatic:
      'On renzi, the first day of the first month, Academician of the Baomo Pavilion Lin Jue and Lizhou Observation Commissioner Wang Kangcheng of Song came for the New Year. On renxu day Acting Minister of Works Ding Changren and Yanzhou Observation Commissioner Guo Tan presented bequest gifts. On yihai day in the third month Acting Minister of Justice Yu Chou and Quanzhou Observation Commissioner Zhang Zhongshu and others of Song came to report thanks. On bingshen day in the eighth month Acting Minister of Revenue Yu Lie and Fuzhou Observation Commissioner Li Yan and others came to report thanks; that same day Acting Minister of Personnel Chen Zongzhao and Guangzhou Observation Commissioner Dou Kui were dispatched for the Heavenly Longevity Festival. On wushen day in the ninth month Right Commissioner of the Palace Secretariat Tushan Huaizhong and others were dispatched as birthday envoys to Song. On gengshen day in the eleventh month General of the Right Palace Guard Heshilie Qijin and others were dispatched as New Year envoys to Song.',
  },
  s0051: {
    literal:
      'On the first day of the first month, the day renzi, Western Xia Military Integrity Grand Master Wodezhong and Virtue-Proclaiming Gentleman Liu Junguo congratulated the New Year. On the day yichou of the third month, Western Xia Senior General of the Left Jinwu Guard Yeyu Siwen, Prefect of Zhongxing Tian Wenhui, and others came to thank them for the grace. On the first day of the eighth month, the day wuyin, Western Xia Military Integrity Grand Master Rousiyi and Virtue-Proclaiming Gentleman Jiao Siyuan and others congratulated the Heavenly Longevity Festival.',
    idiomatic:
      'On renzi, the first day of the first month, Western Xia Military Integrity Grand Master Wodezhong and Virtue-Proclaiming Gentleman Liu Junguo came for the New Year. On yichou day in the third month Senior General of the Left Jinwu Guard Yeyu Siwen, Prefect of Zhongxing Tian Wenhui, and others came to thank the court for its grace. On wuyin, the first day of the eighth month, Military Integrity Grand Master Rousiyi and Virtue-Proclaiming Gentleman Jiao Siyuan and others came for the Heavenly Longevity Festival.',
  },
  s0052: {
    literal:
      'On the first day of the first month, the day renzi, Goryeo Minor Official of Guests Li Weiqing congratulated the New Year. In the eighth month, Goryeo Vice Minister of Revenue Zheng Gongshun congratulated the Heavenly Longevity Festival; Minor Official of Guests Zhao Shu presented tribute, and Director of the Court of Imperial Regalia Qin Yankuang thanked them for the birthday gift. On the day yisi of the twelfth month, Goryeo Minor Official of Guests Cui Nanfu presented tribute.',
    idiomatic:
      'On renzi, the first day of the first month, Goryeo Minor Official of Guests Li Weiqing came for the New Year. In the eighth month Vice Minister of Revenue Zheng Gongshun came for the Heavenly Longevity Festival; Minor Official of Guests Zhao Shu presented tribute and Director of the Court of Imperial Regalia Qin Yankuang thanked the court for the birthday gift. On yisi day in the twelfth month Minor Official of Guests Cui Nanfu presented tribute.',
  },
};

const path = '/workspace/translations/current_translation_jinshi.json';
const data = JSON.parse(readFileSync(path, 'utf8'));
let n = 0;
for (const s of data.sentences) {
  const t = T[s.id];
  if (t) {
    s.literal = t.literal;
    s.idiomatic = t.idiomatic;
    n++;
  }
}
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${n} sentences`);
