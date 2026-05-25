/**
 * Canonical metadata for all 26 works (24 Histories + Zizhi Tongjian + Qing Shigao).
 * Used for manifest generation, citations, and backfilling chapter JSON bookInfo.
 */

export const CHRONOLOGICAL_ORDER = [
  'shiji',
  'hanshu',
  'houhanshu',
  'sanguozhi',
  'jinshu',
  'songshu',
  'nanqishu',
  'liangshu',
  'chenshu',
  'weishu',
  'beiqishu',
  'zhoushu',
  'suishu',
  'nanshi',
  'beishi',
  'jiutangshu',
  'xintangshu',
  'jiuwudaishi',
  'xinwudaishi',
  'songshi',
  'liaoshi',
  'jinshi',
  'yuanshi',
  'mingshi',
];

export const OTHER_WORKS_ORDER = ['zizhitongjian', 'qingshigao'];

/** @type {Record<string, {
 *   name: string,
 *   chinese: string,
 *   pinyin: string,
 *   dynasty: string,
 *   author: string,
 *   authorChinese: string,
 *   category?: string
 * }>} */
export const BOOK_METADATA = {
  shiji: {
    name: 'Records of the Grand Historian',
    chinese: '史記',
    pinyin: 'Shǐjì',
    dynasty: 'Xia to Han',
    author: 'Sima Qian',
    authorChinese: '司馬遷',
  },
  hanshu: {
    name: 'Book of Han',
    chinese: '漢書',
    pinyin: 'Hànshū',
    dynasty: 'Western Han',
    author: 'Ban Gu',
    authorChinese: '班固',
  },
  houhanshu: {
    name: 'Book of Later Han',
    chinese: '後漢書',
    pinyin: 'Hòu Hànshū',
    dynasty: 'Eastern Han',
    author: 'Fan Ye',
    authorChinese: '范曄',
  },
  sanguozhi: {
    name: 'Records of the Three Kingdoms',
    chinese: '三國志',
    pinyin: 'Sānguó Zhì',
    dynasty: 'Three Kingdoms',
    author: 'Chen Shou',
    authorChinese: '陳壽',
  },
  jinshu: {
    name: 'Book of Jin',
    chinese: '晉書',
    pinyin: 'Jìnshū',
    dynasty: 'Jin',
    author: 'Fang Xuanling et al.',
    authorChinese: '房玄齡等',
  },
  songshu: {
    name: 'Book of Song',
    chinese: '宋書',
    pinyin: 'Sòngshū',
    dynasty: 'Liu Song',
    author: 'Shen Yue',
    authorChinese: '沈約',
  },
  nanqishu: {
    name: 'Book of Southern Qi',
    chinese: '南齊書',
    pinyin: 'Nán Qíshū',
    dynasty: 'Southern Qi',
    author: 'Xiao Zixian',
    authorChinese: '蕭子顯',
  },
  liangshu: {
    name: 'Book of Liang',
    chinese: '梁書',
    pinyin: 'Liángshū',
    dynasty: 'Liang',
    author: 'Yao Silian',
    authorChinese: '姚思廉',
  },
  chenshu: {
    name: 'Book of Chen',
    chinese: '陳書',
    pinyin: 'Chénshū',
    dynasty: 'Chen',
    author: 'Yao Silian',
    authorChinese: '姚思廉',
  },
  weishu: {
    name: 'Book of Wei',
    chinese: '魏書',
    pinyin: 'Wèishū',
    dynasty: 'Northern Wei',
    author: 'Wei Shou',
    authorChinese: '魏收',
  },
  beiqishu: {
    name: 'Book of Northern Qi',
    chinese: '北齊書',
    pinyin: 'Běi Qíshū',
    dynasty: 'Northern Qi',
    author: 'Li Baiyao',
    authorChinese: '李百藥',
  },
  zhoushu: {
    name: 'Book of Zhou',
    chinese: '周書',
    pinyin: 'Zhōushū',
    dynasty: 'Northern Zhou',
    author: 'Linghu Defen et al.',
    authorChinese: '令狐德棻等',
  },
  suishu: {
    name: 'Book of Sui',
    chinese: '隋書',
    pinyin: 'Suíshū',
    dynasty: 'Sui',
    author: 'Wei Zheng et al.',
    authorChinese: '魏徵等',
  },
  nanshi: {
    name: 'History of the Southern Dynasties',
    chinese: '南史',
    pinyin: 'Nánshǐ',
    dynasty: 'Southern Dynasties',
    author: 'Li Yanshou',
    authorChinese: '李延壽',
  },
  beishi: {
    name: 'History of the Northern Dynasties',
    chinese: '北史',
    pinyin: 'Běishǐ',
    dynasty: 'Northern Dynasties',
    author: 'Li Yanshou',
    authorChinese: '李延壽',
  },
  jiutangshu: {
    name: 'Old Book of Tang',
    chinese: '舊唐書',
    pinyin: 'Jiù Tángshū',
    dynasty: 'Tang',
    author: 'Liu Xu et al.',
    authorChinese: '劉昫等',
  },
  xintangshu: {
    name: 'New Book of Tang',
    chinese: '新唐書',
    pinyin: 'Xīn Tángshū',
    dynasty: 'Tang',
    author: 'Ouyang Xiu and Song Qi',
    authorChinese: '歐陽修、宋祁',
  },
  jiuwudaishi: {
    name: 'Old History of the Five Dynasties',
    chinese: '舊五代史',
    pinyin: 'Jiù Wǔdàishǐ',
    dynasty: 'Five Dynasties',
    author: 'Xue Juzheng et al.',
    authorChinese: '薛居正等',
  },
  xinwudaishi: {
    name: 'New History of the Five Dynasties',
    chinese: '新五代史',
    pinyin: 'Xīn Wǔdàishǐ',
    dynasty: 'Five Dynasties',
    author: 'Ouyang Xiu',
    authorChinese: '歐陽修',
  },
  songshi: {
    name: 'History of Song',
    chinese: '宋史',
    pinyin: 'Sòngshǐ',
    dynasty: 'Song',
    author: "Toqto'a et al.",
    authorChinese: '脫脫等',
  },
  liaoshi: {
    name: 'History of Liao',
    chinese: '遼史',
    pinyin: 'Liáoshǐ',
    dynasty: 'Liao (Khitan)',
    author: "Toqto'a et al.",
    authorChinese: '脫脫等',
  },
  jinshi: {
    name: 'History of Jin',
    chinese: '金史',
    pinyin: 'Jīnshǐ',
    dynasty: 'Jin (Jurchen)',
    author: "Toqto'a et al.",
    authorChinese: '脫脫等',
  },
  yuanshi: {
    name: 'History of Yuan',
    chinese: '元史',
    pinyin: 'Yuánshǐ',
    dynasty: 'Yuan (Mongol)',
    author: 'Song Lian et al.',
    authorChinese: '宋濂等',
  },
  mingshi: {
    name: 'History of Ming',
    chinese: '明史',
    pinyin: 'Míngshǐ',
    dynasty: 'Ming',
    author: 'Zhang Tingyu et al.',
    authorChinese: '張廷玉等',
  },
  zizhitongjian: {
    name: 'Comprehensive Mirror in Aid of Governance',
    chinese: '資治通鑑',
    pinyin: 'Zīzhì Tōngjiàn',
    dynasty: 'Warring States to Five Dynasties',
    author: 'Sima Guang',
    authorChinese: '司馬光',
    category: 'otherWorks',
  },
  qingshigao: {
    name: 'Draft History of Qing',
    chinese: '清史稿',
    pinyin: 'Qīngshǐgǎo',
    dynasty: 'Qing',
    author: 'Zhao Erxun et al.',
    authorChinese: '趙爾巽等',
    category: 'otherWorks',
  },
};

for (const id of CHRONOLOGICAL_ORDER) {
  BOOK_METADATA[id].category = BOOK_METADATA[id].category || 'twentyFourHistories';
}

export function getBookMetadata(bookId) {
  return BOOK_METADATA[bookId] || null;
}

export function mergeBookInfo(bookId, bookInfo = {}) {
  const canonical = getBookMetadata(bookId);
  if (!canonical) return { ...bookInfo };
  return {
    ...bookInfo,
    name: bookInfo.name || canonical.name,
    chinese: bookInfo.chinese || canonical.chinese,
    pinyin: bookInfo.pinyin || canonical.pinyin,
    dynasty: bookInfo.dynasty || canonical.dynasty,
    author: bookInfo.author || canonical.author,
    authorChinese: bookInfo.authorChinese || canonical.authorChinese,
    category: bookInfo.category || canonical.category,
  };
}
