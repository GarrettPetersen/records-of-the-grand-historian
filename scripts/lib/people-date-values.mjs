import { personClaimReception } from './people-reception.mjs';
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

export function hasDateBearingChronology(value) {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(hasDateBearingChronology);
  if (value.undatedSourceAttestation === true) return false;
  if (['westernYear', 'westernInterval', 'westernBounds', 'sourceDate', 'qualitative', 'unresolved'].some(key => Object.hasOwn(value, key))) return true;
  return Object.values(value).some(hasDateBearingChronology);
}

// Unlike a source-date or an explicitly unresolved context, a concrete
// Western chronology can support an English active-date hint. Keep this
// distinction explicit: unresolved dates must remain auditable, but they do
// not justify fabricating a year of a person's activity.
export function hasConcreteWesternChronology(value) {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(hasConcreteWesternChronology);
  if (Object.hasOwn(value, 'westernYear') || Object.hasOwn(value, 'westernInterval') || Object.hasOwn(value, 'westernBounds')) return true;
  return Object.entries(value)
    .filter(([key]) => !['sourceDate', 'unresolved', 'unresolvedReason', 'undatedSourceAttestation'].includes(key))
    .some(([, child]) => hasConcreteWesternChronology(child));
}

// A death date establishes chronology but is not evidence that someone was
// active in that year.  Keep this shared between repair staging and production
// validation so a date audit can remove an invented "active" hint without
// erasing a well-supported death record.
export function deathOnlyChronology(claims) {
  const read = claim => Array.isArray(claim)
    ? { predicate: claim[1], value: claim[2] }
    : claim;
  const temporal = claims.map(read).filter(claim => hasDateBearingChronology(claim.value));
  const reception = value => personClaimReception({value}) === 'retrospective';
  return temporal.length > 0 && temporal.every(({ predicate, value }) =>
    predicate === 'death' ||
    (predicate === 'place-association' && value?.relation === 'died-at') ||
    (predicate === 'event-participation' && value?.kind === 'death' && value?.role === 'deceased') ||
    reception(value) ||
    (predicate === 'attestation' && /\b(died|death|deceased)\b|[死卒薨]/iu.test(JSON.stringify(value))));
}

export function boundedDateLabel(value, formatYear) {
  const bounds = temporalContainers(value).map(item => item.westernBounds).filter(Boolean);
  if (bounds.length !== 1) return null;
  if (westernBoundsErrors(bounds[0]).length) throw new Error('Invalid Western bounds in person presentation');
  const labels = { before: 'before', onOrBefore: 'on or before', after: 'after', onOrAfter: 'on or after' };
  return Object.entries(bounds[0]).map(([key, year]) => `${labels[key]} ${formatYear(year)}`).join(' and ');
}
