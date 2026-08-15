export const PERSON_PAGE_SHARD_COUNT = 1024;

export function normalizePersonPageSlug(value) {
  return String(value ?? '').replace(/\.html$/u, '');
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
