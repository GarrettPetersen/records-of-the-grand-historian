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

export function personLifeSummary(person) {
  const births = yearClaims(person.life.birth);
  const deaths = yearClaims(person.life.death);
  const active = yearClaims(person.life.attestedActivity).sort((a, b) => a.sort - b.sort);
  const born = births[0]?.label ?? null;
  const died = deaths[0]?.label ?? null;
  if (born || died) return [born ?? '?', died ?? '?'].join(' - ');
  if (active.length === 1) return `Attested ${active[0].label}`;
  if (active.length > 1) return `Attested ${active[0].label} - ${active.at(-1).label}`;
  return 'Dates uncertain';
}

export function personAlternateNames(person) {
  return [...new Set(person.names.flatMap((name) => [name.en, name.zh, name.pinyin]).filter(Boolean))]
    .filter((name) => ![person.preferredName.en, person.preferredName.zh, person.preferredName.pinyin].includes(name));
}
