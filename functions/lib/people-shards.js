export const PERSON_PAGE_SHARD_COUNT = 1024;
const PERSON_ID_PATTERN = /^per_([0-9A-HJKMNP-TV-Z]{20})$/u;
const PERSON_SLUG_SUFFIX_PATTERN = /(?:^|-)([0-9a-hjkmnp-tv-z]{8})$/u;

export function normalizePersonPageSlug(value) {
  return String(value ?? '').replace(/\.html$/u, '');
}

export function personIdSlugSuffix(value) {
  const match = PERSON_ID_PATTERN.exec(String(value ?? ''));
  if (!match) throw new Error(`Invalid canonical person ID: ${value}`);
  return match[1].slice(0, 8).toLocaleLowerCase('en');
}

export function personPageSlugSuffix(value) {
  return PERSON_SLUG_SUFFIX_PATTERN.exec(normalizePersonPageSlug(value))?.[1] ?? null;
}

export function personPageShardName(value) {
  const slug = normalizePersonPageSlug(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < slug.length; index += 1) {
    hash ^= slug.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return String(hash % PERSON_PAGE_SHARD_COUNT).padStart(4, '0');
}
