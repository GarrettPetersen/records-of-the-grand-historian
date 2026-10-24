// Advisory only: compact claims do not carry stable IDs. Exact-content matching
// does not identify edited claims, prove identity or authorize publication.
// The full positional inventory remains the required structural review input.
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}

/** Inputs must already be parsed by parseCurationDriftJson. */
export function claimContentView(before, after) {
  if (!Array.isArray(before?.claims) || !Array.isArray(after?.claims)) throw new Error('Both snapshots must contain claims arrays');
  const index = claims => {
    const map = new Map();
    claims.forEach((claim, position) => {
      const key = JSON.stringify(canonical(claim));
      if (!map.has(key)) map.set(key, { value: claim, positions: [] });
      map.get(key).positions.push(position);
    });
    return map;
  };
  const left = index(before.claims), right = index(after.claims);
  const matched = [], removed = [], added = [], ambiguous = [];
  for (const key of new Set([...left.keys(), ...right.keys()])) {
    const a = left.get(key), b = right.get(key);
    const beforePositions = a?.positions ?? [], afterPositions = b?.positions ?? [];
    const common = Math.min(beforePositions.length, afterPositions.length);
    if (beforePositions.length > 1 || afterPositions.length > 1) {
      ambiguous.push({ value: a ? a.value : b.value, beforePositions, afterPositions });
    }
    // Unique values have exact content correspondence, not historical identity.
    // Duplicate values are never paired, because their identities are unknown.
    if (beforePositions.length === 1 && afterPositions.length === 1) {
      matched.push({ beforeIndex: beforePositions[0], afterIndex: afterPositions[0] });
    }
    if (beforePositions.length > common) removed.push({ value: a.value, count: beforePositions.length - common, positions: beforePositions });
    if (afterPositions.length > common) added.push({ value: b.value, count: afterPositions.length - common, positions: afterPositions });
  }
  matched.sort((a, b) => a.beforeIndex - b.beforeIndex);
  const uniqueContentReordered = matched.some((pair, index) => index > 0 && pair.afterIndex < matched[index - 1].afterIndex);
  return {
    kind: 'advisory-exact-claim-content-not-identity-or-approval',
    warning: 'Changed values appear as removals and additions; duplicate occurrences are ambiguous. Review the complete positional inventory independently.',
    beforeCount: before.claims.length, afterCount: after.claims.length,
    uniqueContentReordered, matchedUniqueCount: matched.length, removed, added, ambiguous,
  };
}
