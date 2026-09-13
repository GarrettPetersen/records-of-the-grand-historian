export function compareWesternYears(a, b) {
  if (a.era !== b.era) return a.era === 'BC' ? -1 : 1;
  return a.era === 'BC' ? b.year - a.year : a.year - b.year;
}

function checkYear(year) {
  if (!year || !['BC', 'AD'].includes(year.era) || !Number.isSafeInteger(year.year) || year.year < 1 || !['year', 'circa'].includes(year.precision)) throw new Error('Time-window endpoints require positive BC/AD years and explicit precision');
}

export function deriveTimeWindow(constraints) {
  if (!Array.isArray(constraints) || !constraints.length) throw new Error('At least one time constraint is required');
  let start = null;
  let end = null;
  for (const constraint of constraints) {
    checkYear(constraint.start);
    checkYear(constraint.end);
    if (compareWesternYears(constraint.start, constraint.end) > 0) throw new Error('Source event window is reversed');
    if (!['during', 'after', 'before'].includes(constraint.relation)) throw new Error('Unknown time-window relation');
    // After an uncertain event uses its earliest possible year, not its latest.
    if (constraint.relation !== 'before' && (!start || compareWesternYears(constraint.start, start) > 0)) start = constraint.start;
    if (constraint.relation !== 'after' && (!end || compareWesternYears(constraint.end, end) < 0)) end = constraint.end;
  }
  if (start && end && compareWesternYears(start, end) > 0) throw new Error('Chronology constraints have no overlapping possible years');
  return { bounded: Boolean(start && end), start: start && structuredClone(start), end: end && structuredClone(end),
    instruction: 'These are inclusive year-level bounds for WHEN an event could have occurred, not a claim of continuous activity. Historical identification of the input events still requires source evidence and independent review. Do not replace a one-sided bound with a circa point date.' };
}
