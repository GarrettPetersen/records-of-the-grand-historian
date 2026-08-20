export function tableCells(block) {
  return block?.cells || block?.sentences || [];
}

function sourceCellText(cell) {
  return String(cell?.zh ?? cell?.content ?? '').replace(/\s+/gu, ' ').trim();
}

export function isSemanticTableHeader(block) {
  if (block?.type !== 'table_header') return false;
  const labels = tableCells(block).map(sourceCellText).filter(Boolean);
  if (labels.length === 0) return true;
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
