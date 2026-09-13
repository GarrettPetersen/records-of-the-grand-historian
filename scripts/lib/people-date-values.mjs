const BOUND_KEYS = ['before', 'onOrBefore', 'after', 'onOrAfter'];

export function westernYearOrder(year) {
  return year.era === 'BC' ? 1 - year.year : year.year;
}

export function westernBoundsErrors(bounds) {
  if (!bounds || typeof bounds !== 'object' || Array.isArray(bounds)) return ['westernBounds must be an object'];
  const keys = Object.keys(bounds);
  if (!keys.length || keys.some(key => !BOUND_KEYS.includes(key))) return ['westernBounds requires before/onOrBefore/after/onOrAfter year objects'];
  if ((bounds.before && bounds.onOrBefore) || (bounds.after && bounds.onOrAfter)) return ['Use only one bound per direction'];
  for (const [key, year] of Object.entries(bounds)) {
    if (!year || !['BC', 'AD'].includes(year.era) || !Number.isSafeInteger(year.year) || year.year < 1 || !['year', 'circa'].includes(year.precision)) return [`Invalid ${key} bound; use positive BC/AD years and explicit precision`];
  }
  const lower = bounds.after ?? bounds.onOrAfter;
  const upper = bounds.before ?? bounds.onOrBefore;
  if (lower && upper) {
    const difference = westernYearOrder(lower) - westernYearOrder(upper);
    if (difference > 0 || (difference === 0 && (bounds.before || bounds.after))) return ['Contradictory Western date bounds'];
  }
  return [];
}

export function temporalContainers(value) {
  if (!value || typeof value !== 'object') return [];
  const found = ['westernYear', 'westernInterval', 'westernBounds', 'sourceDate', 'unresolved'].some(key => Object.hasOwn(value, key)) ? [value] : [];
  return [...found, ...Object.entries(value).filter(([key]) => !['westernYear', 'westernInterval', 'westernBounds', 'sourceDate'].includes(key)).flatMap(([, child]) => temporalContainers(child))];
}

export function boundedDateLabel(value, formatYear) {
  const bounds = temporalContainers(value).map(item => item.westernBounds).filter(Boolean);
  if (bounds.length !== 1) return null;
  if (westernBoundsErrors(bounds[0]).length) throw new Error('Invalid Western bounds in person presentation');
  const labels = { before: 'before', onOrBefore: 'on or before', after: 'after', onOrAfter: 'on or after' };
  return Object.entries(bounds[0]).map(([key, year]) => `${labels[key]} ${formatYear(year)}`).join(' and ');
}
