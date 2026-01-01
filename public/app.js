// Complete book metadata for all 24 dynastic histories (for reference)
// Books are loaded dynamically from manifest.json and sorted chronologically
export const BOOKS = {
  shiji: {
    name: 'Records of the Grand Historian',
    chinese: '史記',
    pinyin: 'Shǐjì',
    dynasty: 'Xia to Han',
    author: 'Sima Qian',
    authorChinese: '司馬遷'
  },
  hanshu: {
    name: 'Book of Han',
    chinese: '漢書',
    pinyin: 'Hànshū',
    dynasty: 'Western Han',
    author: 'Ban Gu',
    authorChinese: '班固'
  },
  houhanshu: {
    name: 'Book of Later Han',
    chinese: '後漢書',
    pinyin: 'Hòu Hànshū',
    dynasty: 'Eastern Han',
    author: 'Fan Ye',
    authorChinese: '范曄'
  },
  sanguozhi: {
    name: 'Records of the Three Kingdoms',
    chinese: '三國志',
    pinyin: 'Sānguó Zhì',
    dynasty: 'Three Kingdoms',
    author: 'Chen Shou',
    authorChinese: '陳壽'
  },
  jinshu: {
    name: 'Book of Jin',
    chinese: '晉書',
    pinyin: 'Jìnshū',
    dynasty: 'Jin',
    author: 'Fang Xuanling et al.',
    authorChinese: '房玄齡等'
  },
  songshu: {
    name: 'Book of Song',
    chinese: '宋書',
    pinyin: 'Sòngshū',
    dynasty: 'Liu Song',
    author: 'Shen Yue',
    authorChinese: '沈約'
  },
  nanqishu: {
    name: 'Book of Southern Qi',
    chinese: '南齊書',
    pinyin: 'Nán Qíshū',
    dynasty: 'Southern Qi',
    author: 'Xiao Zixian',
    authorChinese: '蕭子顯'
  },
  liangshu: {
    name: 'Book of Liang',
    chinese: '梁書',
    pinyin: 'Liángshū',
    dynasty: 'Liang',
    author: 'Yao Silian',
    authorChinese: '姚思廉'
  },
  chenshu: {
    name: 'Book of Chen',
    chinese: '陳書',
    pinyin: 'Chénshū',
    dynasty: 'Chen',
    author: 'Yao Silian',
    authorChinese: '姚思廉'
  },
  weishu: {
    name: 'Book of Wei',
    chinese: '魏書',
    pinyin: 'Wèishū',
    dynasty: 'Northern Wei',
    author: 'Wei Shou',
    authorChinese: '魏收'
  },
  beiqishu: {
    name: 'Book of Northern Qi',
    chinese: '北齊書',
    pinyin: 'Běi Qíshū',
    dynasty: 'Northern Qi',
    author: 'Li Baiyao',
    authorChinese: '李百藥'
  },
  zhoushu: {
    name: 'Book of Zhou',
    chinese: '周書',
    pinyin: 'Zhōushū',
    dynasty: 'Northern Zhou',
    author: 'Linghu Defen et al.',
    authorChinese: '令狐德棻等'
  },
  suishu: {
    name: 'Book of Sui',
    chinese: '隋書',
    pinyin: 'Suíshū',
    dynasty: 'Sui',
    author: 'Wei Zheng et al.',
    authorChinese: '魏徵等'
  },
  nanshi: {
    name: 'History of the Southern Dynasties',
    chinese: '南史',
    pinyin: 'Nánshǐ',
    dynasty: 'Southern Dynasties',
    author: 'Li Yanshou',
    authorChinese: '李延壽'
  },
  beishi: {
    name: 'History of the Northern Dynasties',
    chinese: '北史',
    pinyin: 'Běishǐ',
    dynasty: 'Northern Dynasties',
    author: 'Li Yanshou',
    authorChinese: '李延壽'
  },
  jiutangshu: {
    name: 'Old Book of Tang',
    chinese: '舊唐書',
    pinyin: 'Jiù Tángshū',
    dynasty: 'Tang',
    author: 'Liu Xu et al.',
    authorChinese: '劉昫等'
  },
  xintangshu: {
    name: 'New Book of Tang',
    chinese: '新唐書',
    pinyin: 'Xīn Tángshū',
    dynasty: 'Tang',
    author: 'Ouyang Xiu and Song Qi',
    authorChinese: '歐陽修、宋祁'
  },
  jiuwudaishi: {
    name: 'Old History of the Five Dynasties',
    chinese: '舊五代史',
    pinyin: 'Jiù Wǔdàishǐ',
    dynasty: 'Five Dynasties',
    author: 'Xue Juzheng et al.',
    authorChinese: '薛居正等'
  },
  xinwudaishi: {
    name: 'New History of the Five Dynasties',
    chinese: '新五代史',
    pinyin: 'Xīn Wǔdàishǐ',
    dynasty: 'Five Dynasties',
    author: 'Ouyang Xiu',
    authorChinese: '歐陽修'
  },
  songshi: {
    name: 'History of Song',
    chinese: '宋史',
    pinyin: 'Sòngshǐ',
    dynasty: 'Song',
    author: 'Toqto\'a et al.',
    authorChinese: '脫脫等'
  },
  liaoshi: {
    name: 'History of Liao',
    chinese: '遼史',
    pinyin: 'Liáoshǐ',
    dynasty: 'Liao (Khitan)',
    author: 'Toqto\'a et al.',
    authorChinese: '脫脫等'
  },
  jinshi: {
    name: 'History of Jin',
    chinese: '金史',
    pinyin: 'Jīnshǐ',
    dynasty: 'Jin (Jurchen)',
    author: 'Toqto\'a et al.',
    authorChinese: '脫脫等'
  },
  yuanshi: {
    name: 'History of Yuan',
    chinese: '元史',
    pinyin: 'Yuánshǐ',
    dynasty: 'Yuan (Mongol)',
    author: 'Song Lian et al.',
    authorChinese: '宋濂等'
  },
  mingshi: {
    name: 'History of Ming',
    chinese: '明史',
    pinyin: 'Míngshǐ',
    dynasty: 'Ming',
    author: 'Zhang Tingyu et al.',
    authorChinese: '張廷玉等'
  }
};

let manifest = null;

export async function loadManifest() {
  if (manifest) return manifest;
  
  try {
    const response = await fetch('/data/manifest.json');
    if (response.ok) {
      manifest = await response.json();
      return manifest;
    }
  } catch (e) {
    console.error('Failed to load manifest:', e);
  }
  
  return { books: {} };
}

async function loadAvailableHistories() {
  const data = await loadManifest();
  return data.books || {};
}

// Chronological order of the 24 dynastic histories
const CHRONOLOGICAL_ORDER = [
  'shiji',        // Records of the Grand Historian - Xia to Han
  'hanshu',       // Book of Han - Western Han
  'houhanshu',    // Book of Later Han - Eastern Han
  'sanguozhi',    // Records of the Three Kingdoms - Three Kingdoms
  'jinshu',       // Book of Jin - Jin
  'songshu',      // Book of Song - Liu Song
  'nanqishu',     // Book of Southern Qi - Southern Qi
  'liangshu',     // Book of Liang - Liang
  'chenshu',      // Book of Chen - Chen
  'weishu',       // Book of Wei - Northern Wei
  'beiqishu',     // Book of Northern Qi - Northern Qi
  'zhoushu',      // Book of Zhou - Northern Zhou
  'suishu',       // Book of Sui - Sui
  'nanshi',       // History of the Southern Dynasties - Southern Dynasties
  'beishi',       // History of the Northern Dynasties - Northern Dynasties
  'jiutangshu',   // Old Book of Tang - Tang
  'xintangshu',   // New Book of Tang - Tang
  'jiuwudaishi',  // Old History of the Five Dynasties - Five Dynasties
  'xinwudaishi',  // New History of the Five Dynasties - Five Dynasties
  'songshi',      // History of Song - Song
  'liaoshi',      // History of Liao - Liao (Khitan)
  'jinshi',       // History of Jin - Jin (Jurchen)
  'yuanshi',      // History of Yuan - Yuan (Mongol)
  'mingshi'       // History of Ming - Ming
];

async function renderHomepage() {
  const loading = document.getElementById('loading');
  const grid = document.getElementById('histories-grid');

  const histories = await loadAvailableHistories();

  loading.style.display = 'none';
  grid.style.display = 'grid';

  if (Object.keys(histories).length === 0) {
    grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No histories available yet. Run the scraper to add content.</p>';
    return;
  }

  // Sort available books by chronological order of the 24 dynastic histories
  const availableBooks = Object.keys(histories);
  const sortedBookIds = CHRONOLOGICAL_ORDER.filter(id => availableBooks.includes(id));

  // Add any books not in the chronological list at the end
  const remainingBooks = availableBooks.filter(id => !sortedBookIds.includes(id));
  sortedBookIds.push(...remainingBooks);

  for (const id of sortedBookIds) {
    const info = histories[id];
    const card = document.createElement('a');
    card.className = 'history-card';
    card.href = `chapters.html?book=${id}`;

    card.innerHTML = `
      <h3>${info.chinese}</h3>
      <div class="pinyin">${info.pinyin}</div>
      <div class="english-name">${info.name}</div>
      <div class="dynasty">Dynasty: ${info.dynasty}</div>
      <div class="chapter-count">Click to browse chapters</div>
    `;

    grid.appendChild(card);
  }
}

// Initialize on page load
if (document.getElementById('histories-grid')) {
  renderHomepage();
}
