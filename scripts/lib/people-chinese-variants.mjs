import { CHINESE_VARIANT_GROUPS } from './people-chinese-variant-data.mjs';

const representatives = new Map();
for (const group of CHINESE_VARIANT_GROUPS) {
  const characters = [...group];
  for (const character of characters) {
    if (representatives.has(character)) throw new Error('Overlapping Chinese variant groups');
    representatives.set(character, characters[0]);
  }
}

// This internal possible-equivalence key can only retain English-name comparisons.
// It must not replace source/name keys, supply blocking aliases, or merge people.
export function chineseVariantComparisonKey(normalizedChineseNameKey) {
  if (!normalizedChineseNameKey.startsWith('zh:')) throw new Error('Expected a normalized Chinese name key');
  return 'zh:' + [...normalizedChineseNameKey.slice(3)]
    .map((character) => representatives.get(character) ?? character).join('');
}
