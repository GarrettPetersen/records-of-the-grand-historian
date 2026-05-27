export const BOOK_DESIGN = {
  shiji: { color: '#9f2f2f', coverage: 'Antiquity to Early Han' },
  hanshu: { color: '#b65b2a', coverage: 'Western Han' },
  houhanshu: { color: '#b8841f', coverage: 'Eastern Han' },
  sanguozhi: { color: '#6f7f2a', coverage: 'Three Kingdoms' },
  jinshu: { color: '#2f7d59', coverage: 'Jin and Sixteen Kingdoms' },
  songshu: { color: '#248073', coverage: 'Liu Song' },
  nanqishu: { color: '#26758c', coverage: 'Southern Qi' },
  liangshu: { color: '#2f6595', coverage: 'Liang' },
  chenshu: { color: '#4f5f99', coverage: 'Chen' },
  weishu: { color: '#6654a3', coverage: 'Northern Wei' },
  beiqishu: { color: '#7a4c98', coverage: 'Northern Qi' },
  zhoushu: { color: '#8d467f', coverage: 'Northern Zhou' },
  suishu: { color: '#a23e65', coverage: 'Sui' },
  nanshi: { color: '#7f6b2f', coverage: 'Southern Dynasties' },
  beishi: { color: '#5f7240', coverage: 'Northern Dynasties' },
  jiutangshu: { color: '#91622f', coverage: 'Tang' },
  xintangshu: { color: '#a34f36', coverage: 'Tang' },
  jiuwudaishi: { color: '#7b5a4b', coverage: 'Five Dynasties' },
  xinwudaishi: { color: '#8f4f4d', coverage: 'Five Dynasties' },
  songshi: { color: '#346f8f', coverage: 'Song' },
  liaoshi: { color: '#3f7680', coverage: 'Liao' },
  jinshi: { color: '#5e7a44', coverage: 'Jin' },
  yuanshi: { color: '#6b6a32', coverage: 'Yuan' },
  mingshi: { color: '#ad3d35', coverage: 'Ming' },
  zizhitongjian: { color: '#374f86', coverage: 'Warring States to Five Dynasties' },
  qingshigao: { color: '#5f6670', coverage: 'Qing' }
};

export function getBookDesign(bookId) {
  return BOOK_DESIGN[bookId] || { color: '#1a5490', coverage: '' };
}
