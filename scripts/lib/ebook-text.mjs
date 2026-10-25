export function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function textContent(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

// Table cells retain a small amount of source layout metadata in the JSON.
// It is useful to the web renderer but should never leak into a reading excerpt.
export function visibleTableText(value) {
  return String(value ?? '').replace(/^((?:(?:rowspan|colspan|valign|align|style|class)\s*=\s*"[^"]*"\s*)+)\|\s*/iu, '');
}

export function formatList(values) {
  const items = values.map(textContent).filter(Boolean);
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

export function getTranslationObject(item) {
  if (!item) return null;
  if (typeof item.idiomatic === 'string' || typeof item.literal === 'string' || typeof item.translation === 'string') {
    return null;
  }
  const translation = item.translations?.find((entry) => entry.lang === 'en') || item.translations?.[0];
  return translation || null;
}

export function getMainText(item) {
  if (!item) return '';
  const direct = item.idiomatic || item.literal || item.translation;
  if (typeof direct === 'string' && direct.trim()) return direct.trim();
  const trans = getTranslationObject(item);
  if (trans) {
    return textContent(trans.idiomatic || trans.literal || '');
  }
  return '';
}
