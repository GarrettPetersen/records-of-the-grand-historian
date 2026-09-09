export function tableCells(block) {
  return block?.cells || block?.sentences || [];
}

function sourceCellText(cell) {
  return String(cell?.zh ?? cell?.content ?? '').replace(/\s+/gu, ' ').trim();
}

export function isSemanticTableHeader(block, chapter = null) {
  if (block?.type !== 'table_header') return false;
  const labels = tableCells(block).map(sourceCellText).filter(Boolean);
  if (labels.length === 0) return true;
  if (inferChapterTableHeaders(chapter, labels)) return true;
  return labels.every((label) => (
    [...label].length <= 40
    && !/[。！？；.!?;]/u.test(label)
  ));
}

export function tableCellRepeatsLabel(label, value) {
  const normalizedLabel = String(label ?? '').replace(/\s+/gu, ' ').trim();
  const normalizedValue = String(value ?? '')
    .replace(/\s+/gu, ' ')
    .trim()
    .replace(/[.:：。]\s*$/u, '');
  return Boolean(normalizedLabel && normalizedValue)
    && normalizedValue.toLowerCase() === normalizedLabel.toLowerCase();
}

export function inferChapterTableHeaders(chapter, headers) {
  if (chapter?.meta?.book !== 'shiji') return null;
  const columnCount = headers.length;

  if (chapter?.meta?.chapter === '016' && columnCount === 21) {
    return [
      'BCE',
      'Qin',
      'Western Chu',
      'Hengshan',
      'Linjiang',
      'Jiujiang',
      'Changshan',
      'Dai',
      'Linzi',
      'Jibei',
      'Jiaodong',
      'Han (Liu Bang)',
      'Yong',
      'Sai',
      'Di',
      'Yan',
      'Liaodong',
      'Western Wei',
      'Yin',
      'Han (former state)',
      'Henan',
    ];
  }

  if (chapter?.meta?.chapter === '017' && columnCount === 28) {
    return [
      'Year',
      'Reign year',
      'Chu',
      'Lu',
      'Hengshan',
      'Qi',
      'Chengyang',
      'Jibei',
      'Jinan',
      'Langya / Zichuan',
      'Jiaoxi',
      'Jiaodong',
      'Jing',
      'Huainan',
      'Yan',
      'Zhao',
      'Hejian',
      'Guangchuan',
      'Zhongshan',
      'Lujiang',
      'Changshan',
      'Liang',
      'Jichuan',
      'Linjiang',
      'Lü',
      'Huaiyang',
      'Dai',
      'Changsha',
    ];
  }

  if (chapter?.meta?.chapter === '022' && columnCount === 6) {
    return [
      'BCE',
      'Regnal years',
      'Major events',
      'Chancellor',
      'General',
      'Imperial Secretary',
    ];
  }

  return null;
}
