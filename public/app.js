// Complete book metadata for the Twenty-Four Histories and supplemental works.
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
  },
  zizhitongjian: {
    name: 'Comprehensive Mirror in Aid of Governance',
    chinese: '資治通鑑',
    pinyin: 'Zīzhì Tōngjiàn',
    dynasty: 'Warring States to Five Dynasties',
    author: 'Sima Guang',
    authorChinese: '司馬光',
    category: 'otherWorks'
  },
  qingshigao: {
    name: 'Draft History of Qing',
    chinese: '清史稿',
    pinyin: 'Qīngshǐgǎo',
    dynasty: 'Qing',
    author: 'Zhao Erxun et al.',
    authorChinese: '趙爾巽等',
    category: 'otherWorks'
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

/** Labels for the pill on book and chapter cards */
export const TRANSLATION_STATUS_LABELS = {
  full: 'Fully translated',
  partial: 'Partially translated',
  none: 'Not translated',
};

export function escapeHtml(text) {
  if (text == null || text === '') return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

/**
 * Tooltip / title text for a card given translation level and counts.
 * @param {'book' | 'chapter'} scope
 */
export function translationStatusTooltip(level, sentenceTotal, translatedTotal, scope = 'book') {
  if (level === 'full') {
    return scope === 'book'
      ? 'Every sentence in the book has an English translation.'
      : 'Every sentence in this chapter has an English translation.';
  }
  if (level === 'partial') {
    return `${translatedTotal.toLocaleString()} of ${sentenceTotal.toLocaleString()} sentences translated.`;
  }
  if (sentenceTotal > 0) {
    return 'No sentences have been translated yet.';
  }
  return scope === 'book' ? 'No sentence data for this book.' : 'No sentence data for this chapter.';
}

/**
 * Inner markup for a book or chapter card (wrap with `<a class="history-card …">`).
 * @param {object} opts
 * @param {string} [opts.secondaryLineClass] - extra class on the `.pinyin` row (e.g. chapter index)
 */
export function buildHistoryCardInnerHtml({
  titleZh,
  level,
  secondaryLine,
  englishLine,
  metaLine,
  footerLine = '',
  secondaryLineClass = '',
}) {
  const labels = TRANSLATION_STATUS_LABELS;
  const secClass = secondaryLineClass ? ` ${secondaryLineClass}` : '';
  const footerBlock = footerLine
    ? `<div class="chapter-count">${escapeHtml(footerLine)}</div>`
    : '';
  return `
      <div class="history-card-header">
        <h3>${escapeHtml(titleZh)}</h3>
        <span class="translation-status translation-status--${level}">${labels[level]}</span>
      </div>
      <div class="pinyin${secClass}">${escapeHtml(secondaryLine)}</div>
      <div class="english-name">${escapeHtml(englishLine)}</div>
      <div class="dynasty">${escapeHtml(metaLine)}</div>${footerBlock}
    `;
}

/**
 * Aggregate sentence counts from manifest chapters to classify translation coverage.
 * @returns {{ level: 'full' | 'partial' | 'none', sentenceTotal: number, translatedTotal: number }}
 */
export function bookTranslationSummary(book) {
  const chapters = book?.chapters || [];
  let sentenceTotal = 0;
  let translatedTotal = 0;
  for (const ch of chapters) {
    const n = Number(ch.sentenceCount) || 0;
    const t = Number(ch.translatedCount) || 0;
    sentenceTotal += n;
    translatedTotal += Math.min(t, n);
  }
  if (sentenceTotal === 0 || translatedTotal === 0) {
    return { level: 'none', sentenceTotal, translatedTotal };
  }
  if (translatedTotal >= sentenceTotal) {
    return { level: 'full', sentenceTotal, translatedTotal };
  }
  return { level: 'partial', sentenceTotal, translatedTotal };
}

/**
 * Translation coverage for a single chapter row from the manifest.
 * @returns {{ level: 'full' | 'partial' | 'none', sentenceTotal: number, translatedTotal: number }}
 */
export function chapterTranslationSummary(chapter) {
  const sentenceTotal = Number(chapter?.sentenceCount) || 0;
  const translatedTotal = Math.min(Number(chapter?.translatedCount) || 0, sentenceTotal);
  if (sentenceTotal === 0) {
    return { level: 'none', sentenceTotal, translatedTotal };
  }
  if (translatedTotal >= sentenceTotal) {
    return { level: 'full', sentenceTotal, translatedTotal };
  }
  if (translatedTotal > 0) {
    return { level: 'partial', sentenceTotal, translatedTotal };
  }
  return { level: 'none', sentenceTotal, translatedTotal };
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

const OTHER_WORKS_ORDER = [
  'zizhitongjian',
  'qingshigao'
];

async function renderHomepage() {
  const loading = document.getElementById('loading');
  const grid = document.getElementById('histories-grid');
  const otherWorksGrid = document.getElementById('other-works-grid');
  const otherWorksSection = document.getElementById('other-works-section');

  const histories = await loadAvailableHistories();

  loading.style.display = 'none';
  grid.style.display = 'grid';

  if (Object.keys(histories).length === 0) {
    grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No histories available yet. Run the scraper to add content.</p>';
    return;
  }

  // Sort available books by chronological order of the 24 dynastic histories.
  const availableBooks = Object.keys(histories);
  const sortedBookIds = CHRONOLOGICAL_ORDER.filter(id => availableBooks.includes(id));
  const otherWorkIds = OTHER_WORKS_ORDER.filter(id => availableBooks.includes(id));

  const renderCard = (id, targetGrid) => {
    const info = histories[id];
    const { level, sentenceTotal, translatedTotal } = bookTranslationSummary(info);
    const card = document.createElement('a');
    card.className = `history-card history-card--translation-${level}`;
    card.href = `chapters.html?book=${id}`;
    card.title = translationStatusTooltip(level, sentenceTotal, translatedTotal, 'book');

    const bookFooter =
      sentenceTotal > 0
        ? `${translatedTotal.toLocaleString()} of ${sentenceTotal.toLocaleString()} sentences`
        : '';

    card.innerHTML = buildHistoryCardInnerHtml({
      titleZh: info.chinese,
      level,
      secondaryLine: info.pinyin,
      englishLine: info.name,
      metaLine: `Dynasty: ${info.dynasty}`,
      footerLine: bookFooter,
    });

    targetGrid.appendChild(card);
  };

  for (const id of sortedBookIds) {
    renderCard(id, grid);
  }

  if (otherWorksGrid && otherWorksSection && otherWorkIds.length > 0) {
    otherWorksSection.style.display = 'block';
    otherWorksGrid.style.display = 'grid';
    for (const id of otherWorkIds) {
      renderCard(id, otherWorksGrid);
    }
  }
}

// Initialize on page load
if (document.getElementById('histories-grid')) {
  renderHomepage();
}
