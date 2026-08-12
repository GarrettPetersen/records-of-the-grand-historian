export function personDisplayName(person) {
  return person.preferredName.en || person.preferredName.pinyin || person.preferredName.zh || person.id;
}

export function personFullDisplayName(person) {
  const primary = personDisplayName(person);
  return person.preferredName.zh && person.preferredName.zh !== primary
    ? `${primary} (${person.preferredName.zh})`
    : primary;
}

export function humanizePeopleValue(value) {
  return String(value ?? '')
    .replace(/([a-z])([A-Z])/gu, '$1 $2')
    .replace(/[-_]+/gu, ' ')
    .replace(/^./u, (letter) => letter.toLocaleUpperCase('en'));
}

export function formatPersonWesternYear(value) {
  if (!value || typeof value !== 'object' || !['BC', 'AD'].includes(value.era) || !Number.isInteger(value.year)) {
    return null;
  }
  const prefix = value.precision === 'circa' ? 'c. ' : '';
  return `${prefix}${value.era} ${value.year}`;
}

function yearClaims(claims) {
  return claims.flatMap((claim) => {
    const values = [];
    const visit = (value) => {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') {
        const formatted = formatPersonWesternYear(value);
        if (formatted) values.push({
          label: formatted,
          sort: value.era === 'BC' ? -value.year : value.year,
        });
        else Object.values(value).forEach(visit);
      }
    };
    visit(claim.value);
    return values;
  });
}

function densestTemporalCluster(values, pointFor, maxSpan = 80) {
  if (values.length <= 1) return values;
  const sorted = [...values].sort((left, right) => pointFor(left) - pointFor(right));
  let best = [sorted[0]];
  for (let start = 0, end = 0; start < sorted.length; start += 1) {
    if (end < start) end = start;
    while (end + 1 < sorted.length && pointFor(sorted[end + 1]) - pointFor(sorted[start]) <= maxSpan) end += 1;
    const candidate = sorted.slice(start, end + 1);
    if (candidate.length > best.length) best = candidate;
  }
  return best;
}

function signedWesternYear(value) {
  if (!value || typeof value !== 'object' || !Number.isInteger(value.year)) return null;
  if (value.era === 'BC') return -value.year;
  if (value.era === 'AD') return value.year;
  return null;
}

function claimRepresentativeYear(claim) {
  const years = [];
  const visit = (value) => {
    if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === 'object') {
      const year = signedWesternYear(value);
      if (year !== null) years.push(year);
      else Object.values(value).forEach(visit);
    }
  };
  visit(claim?.value);
  return years.length ? (Math.min(...years) + Math.max(...years)) / 2 : null;
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function representativePersonYear(person) {
  const lifeAnchors = [...person.life.birth, ...person.life.death]
    .map(claimRepresentativeYear).filter((year) => year !== null);
  if (lifeAnchors.length) return median(lifeAnchors);
  const activity = person.life.attestedActivity
    .map(claimRepresentativeYear).filter((year) => year !== null);
  // Later histories often refer retrospectively to famous earlier figures.
  // An isolated date from such a mention must not move a Han figure into a
  // medieval summary or browse page.
  const coherent = densestTemporalCluster(activity, (year) => year);
  return median(coherent);
}

function coherentActivityYears(claims) {
  const datedClaims = claims.map((claim) => yearClaims([claim])).filter((values) => values.length > 0);
  if (datedClaims.length <= 1) return datedClaims.flat();
  const points = datedClaims.map((values) => ({
    values,
    point: (Math.min(...values.map((value) => value.sort)) + Math.max(...values.map((value) => value.sort))) / 2,
  }));
  return densestTemporalCluster(points, ({ point }) => point).flatMap(({ values }) => values);
}

export function personLifeSummary(person) {
  const births = yearClaims(person.life.birth);
  const deaths = yearClaims(person.life.death);
  const active = coherentActivityYears(person.life.attestedActivity).sort((a, b) => a.sort - b.sort);
  const born = births[0]?.label ?? null;
  const died = deaths[0]?.label ?? null;
  if (born && died) return `${born} - ${died}`;
  if (born) return `Born ${born}`;
  if (died) return `Died ${died}`;
  if (active.length === 1) return `Attested ${active[0].label}`;
  if (active.length > 1) return `Attested ${active[0].label} - ${active.at(-1).label}`;
  return 'Dates uncertain';
}

export function personAlternateNames(person) {
  return [...new Set(person.names.flatMap((name) => [name.en, name.zh, name.pinyin]).filter(Boolean))]
    .filter((name) => ![person.preferredName.en, person.preferredName.zh, person.preferredName.pinyin].includes(name));
}
