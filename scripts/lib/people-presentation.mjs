export function personDisplayName(person) {
  return person.preferredName.en || person.preferredName.pinyin || person.preferredName.zh || person.id;
}

export function personFullDisplayName(person) {
  const primary = personDisplayName(person);
  return person.preferredName.zh && person.preferredName.zh !== primary
    ? `${primary} (${person.preferredName.zh})`
    : primary;
}

export function personPublicDescription(person) {
  return String(person.description?.en ?? 'Named Individual')
    .split(/\s+(?:--|—)\s+/u, 1)[0]
    .replace(/\s*;\s*(?:distinct from|not to be confused with|source\b|the translation\b|the text\b).*$/iu, '')
    .trim() || 'Named Individual';
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
          value,
        });
        else Object.values(value).forEach(visit);
      }
    };
    visit(claim.value);
    return values;
  });
}

function astronomicalWesternYear(value) {
  if (!value || !Number.isInteger(value.year)) return null;
  if (value.era === 'AD') return value.year;
  if (value.era === 'BC') return 1 - value.year;
  return null;
}

function westernYearFromAstronomical(year) {
  return year >= 1
    ? { era: 'AD', year, precision: 'circa' }
    : { era: 'BC', year: 1 - year, precision: 'circa' };
}

function numericAge(value) {
  if (!value || typeof value !== 'object') return null;
  const candidates = [
    value.age,
    value.value,
    value.years,
    value.statedAge,
    value.quantity,
    value.age?.value,
    value.age?.age,
  ];
  return candidates.find((age) => Number.isInteger(age) && age > 0 && age <= 150) ?? null;
}

function evidenceOverlaps(left, right) {
  const rightEvidence = new Set(right.evidence ?? []);
  return (left.evidence ?? []).some((evidence) => rightEvidence.has(evidence));
}

function explicitlyAtDeath(value) {
  if (!value || typeof value !== 'object') return false;
  return /(?:death|died|at death|享年|卒年|薨年|崩年)/iu.test(JSON.stringify(value));
}

function inferredBirthCandidates(person) {
  const deaths = person.life?.death ?? [];
  const activity = person.life?.attestedActivity ?? [];
  const datedDeaths = deaths.filter((claim) => yearClaims([claim]).length > 0);
  const datedActivity = activity.filter((claim) => yearClaims([claim]).length > 0);
  const candidates = [];
  const add = (age, claims, priority) => {
    if (!age) return;
    for (const claim of claims) {
      for (const year of yearClaims([claim])) {
        const eventYear = astronomicalWesternYear(year.value);
        if (eventYear !== null) candidates.push({ year: eventYear - age + 1, priority });
      }
    }
  };

  for (const death of datedDeaths) add(numericAge(death.value), [death], 4);
  for (const ageClaim of person.life?.ageClaims ?? []) {
    const age = numericAge(ageClaim.value);
    if (!age) continue;
    const ownYears = yearClaims([ageClaim]);
    if (ownYears.length > 0) {
      const overlapsDeathYear = datedDeaths.some((death) => {
        const deathYears = new Set(yearClaims([death]).map(({ value }) => astronomicalWesternYear(value)));
        return ownYears.some(({ value }) => deathYears.has(astronomicalWesternYear(value)));
      });
      add(age, [ageClaim], overlapsDeathYear ? 4 : 2);
      continue;
    }
    const matchingDeaths = datedDeaths.filter((death) => evidenceOverlaps(ageClaim, death));
    if (matchingDeaths.length > 0) {
      add(age, matchingDeaths, 4);
      continue;
    }
    if (explicitlyAtDeath(ageClaim.value)) {
      add(age, datedDeaths, 4);
      continue;
    }
    add(age, datedActivity.filter((claim) => evidenceOverlaps(ageClaim, claim)), 2);
  }
  return candidates;
}

export function inferredPersonBirthYear(person) {
  const candidates = inferredBirthCandidates(person);
  if (candidates.length === 0) return null;
  const highestPriority = Math.max(...candidates.map(({ priority }) => priority));
  const years = [...new Set(candidates
    .filter(({ priority }) => priority === highestPriority)
    .map(({ year }) => year))].sort((left, right) => left - right);
  const coherent = densestTemporalCluster(years, (year) => year, 4);
  const midpoint = Math.floor((coherent[0] + coherent.at(-1)) / 2);
  return westernYearFromAstronomical(midpoint);
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
  const activity = personCoherentActivityClaims(person)
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

function qualitativeActivitySummary(person) {
  const labels = [...new Set((person.life?.attestedActivity ?? [])
    .map((claim) => String(claim.value?.qualitative ?? '').replace(/\s+/gu, ' ').trim())
    .filter(Boolean))];
  if (labels.length !== 1 || labels[0].length > 80) return null;
  return labels[0].replace(/^./u, (letter) => letter.toLocaleUpperCase('en'));
}

function medianClaimYear(claims) {
  return median(claims.map(claimRepresentativeYear).filter((year) => year !== null));
}

export function personCoherentActivityClaims(person) {
  const claims = person.life?.attestedActivity ?? [];
  if (claims.length <= 1) return [...claims];
  const dated = claims.map((claim) => ({ claim, year: claimRepresentativeYear(claim) }));
  const undated = dated.filter(({ year }) => year === null).map(({ claim }) => claim);
  const datedClaims = dated.filter(({ year }) => year !== null);
  if (datedClaims.length <= 1) return [...claims];

  const birth = medianClaimYear(person.life?.birth ?? []);
  const death = medianClaimYear(person.life?.death ?? []);
  let coherent;
  if (birth !== null || death !== null) {
    const earliest = birth !== null ? birth - 5 : death - 120;
    const latest = death !== null ? death + 1 : birth + 120;
    coherent = datedClaims.filter(({ year }) => year >= earliest && year <= latest);
  } else {
    coherent = densestTemporalCluster(datedClaims, ({ year }) => year);
  }
  if (!coherent.length) coherent = densestTemporalCluster(datedClaims, ({ year }) => year);
  const retained = new Set([...undated, ...coherent.map(({ claim }) => claim)]);
  return claims.filter((claim) => retained.has(claim));
}

export function personLifeSummary(person) {
  const births = yearClaims(person.life.birth);
  const deaths = yearClaims(person.life.death);
  const active = coherentActivityYears(personCoherentActivityClaims(person)).sort((a, b) => a.sort - b.sort);
  const inferredBirth = births.length === 0 ? inferredPersonBirthYear(person) : null;
  const born = births[0]?.label ?? formatPersonWesternYear(inferredBirth);
  const died = deaths[0]?.label ?? null;
  if (born && died) return `${born} - ${died}`;
  if (born) return `Born ${born}`;
  if (died) {
    const deathSort = deaths[0].sort;
    const earliest = active.find((value) => value.sort < deathSort);
    return earliest ? `First attested ${earliest.label}; died ${died}` : `Died ${died}`;
  }
  if (active.length === 1) return `Attested ${active[0].label}`;
  if (active.length > 1) return `Attested ${active[0].label} - ${active.at(-1).label}`;
  const qualitative = qualitativeActivitySummary(person);
  if (qualitative) return qualitative;
  return 'Dates uncertain';
}

export const MAX_PUBLIC_PERSON_ALIASES = 4;

const NAME_KIND_FAMILIES = new Map([
  ['personal', 'personal'],
  ['personal-name', 'personal'],
  ['courtesy', 'courtesy'],
  ['courtesy-name', 'courtesy'],
  ['style', 'courtesy'],
  ['style-name', 'courtesy'],
  ['changed', 'changed'],
  ['changed-name', 'changed'],
  ['changed-or-taboo-avoidance', 'changed'],
  ['changed-or-taboo-avoidance-name', 'changed'],
  ['childhood', 'childhood'],
  ['childhood-name', 'childhood'],
  ['nickname', 'nickname'],
  ['religious', 'religious'],
  ['religious-name', 'religious'],
  ['religious-or-dharma-name', 'religious'],
  ['posthumous', 'posthumous'],
  ['posthumous-name', 'posthumous'],
  ['posthumous-title', 'posthumous'],
  ['temple', 'temple'],
  ['temple-name', 'temple'],
  ['regnal', 'regnal'],
  ['regnal-name', 'regnal'],
  ['regnal-abbreviation', 'regnal'],
  ['regnal-title', 'regnal'],
  ['alternate', 'alternate'],
  ['alternate-name', 'alternate'],
  ['alt', 'alternate'],
  ['textual-variant', 'alternate'],
  ['epithet', 'epithet'],
  ['native-language', 'native'],
  ['native-language-name', 'native'],
  ['native-language-or-transliterated', 'native'],
  ['native-name', 'native'],
  ['native-or-transliterated', 'native'],
  ['transliterated', 'transliterated'],
  ['transliterated-name', 'transliterated'],
  ['surname', 'component'],
  ['given', 'component'],
  ['given-name', 'component'],
  ['clan', 'component'],
  ['clan-name', 'component'],
  ['clan-or-house', 'component'],
  ['clan-or-house-name', 'component'],
  ['house', 'component'],
  ['descriptive', 'reference'],
  ['descriptive-name', 'reference'],
  ['descriptive-kinship', 'reference'],
  ['kinship', 'reference'],
  ['kinship-reference', 'reference'],
  ['clan-reference', 'reference'],
  ['title', 'title'],
  ['title-name', 'title'],
  ['title-reference', 'title'],
  ['noble-title', 'title'],
  ['honorific', 'title'],
  ['honorific-title', 'title'],
  ['dynastic-reference', 'reference'],
  ['ethnicity', 'reference'],
  ['native-place', 'reference'],
]);

const PUBLIC_ALIAS_FAMILIES = new Set([
  'personal', 'courtesy', 'changed', 'childhood', 'posthumous', 'temple',
  'regnal', 'religious', 'nickname', 'native', 'transliterated', 'alternate', 'epithet',
]);

const ALIAS_FAMILY_PRIORITY = new Map([
  ['personal', 130],
  ['changed', 120],
  ['courtesy', 110],
  ['childhood', 100],
  ['religious', 95],
  ['posthumous', 90],
  ['temple', 85],
  ['regnal', 80],
  ['nickname', 70],
  ['native', 65],
  ['transliterated', 60],
  ['alternate', 50],
  ['epithet', 40],
]);

const DISPLAY_KIND_BY_FAMILY = new Map([
  ['personal', 'personal-name'],
  ['courtesy', 'courtesy-name'],
  ['changed', 'changed-name'],
  ['childhood', 'childhood-name'],
  ['religious', 'religious-name'],
  ['posthumous', 'posthumous-name'],
  ['temple', 'temple-name'],
  ['regnal', 'regnal-name'],
  ['nickname', 'nickname'],
  ['native', 'native-name'],
  ['transliterated', 'transliterated-name'],
  ['alternate', 'alternate-name'],
  ['epithet', 'epithet'],
]);

const GENERIC_REFERENCE_CHINESE = new Set([
  '上', '主上', '今上', '先帝', '帝', '皇帝', '天子', '陛下', '至尊', '聖上',
  '君', '王', '后', '皇后', '太后', '皇太后', '太子', '皇太子',
]);

const GENERIC_REFERENCE_ENGLISH = /^(?:the )?(?:emperor|empress|sovereign|ruler|king|queen|prince|princess|crown prince|heir apparent|son of heaven|late emperor|former emperor|earlier emperor|previous emperor|empress dowager|grand empress dowager|lord|duke|marquis|count|baron|khagan|khan|chanyu)$/u;

function normalizeLatinName(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/\p{Mark}+/gu, '')
    .toLocaleLowerCase('en')
    .replace(/[^a-z0-9]+/gu, ' ')
    .trim();
}

function latinNameCore(value) {
  return normalizeLatinName(value)
    .split(' ')
    .filter((token) => !['the', 'emperor', 'empress', 'king', 'queen', 'prince', 'princess', 'of'].includes(token))
    .join(' ');
}

function normalizeChineseName(value) {
  return String(value ?? '').replace(/[\s\p{P}\p{S}]+/gu, '');
}

function rawNameFamily(name) {
  const kind = String(name.kind ?? 'alternate').toLocaleLowerCase('en');
  const family = NAME_KIND_FAMILIES.get(kind);
  if (!family) throw new Error(`Unknown person name kind ${JSON.stringify(name.kind)}`);
  return family;
}

function publicNameFamily(name) {
  const family = rawNameFamily(name);
  const zh = normalizeChineseName(name.zh);
  if (!['component', 'reference'].includes(family)) {
    if (/[\u7956\u5b97]$/u.test(zh)) return 'temple';
    if (/(?:\u7687)?\u5e1d$/u.test(zh) && zh !== '皇帝') return 'posthumous';
  }
  return family;
}

function isGenericReference(name) {
  const zh = normalizeChineseName(name.zh);
  if (zh && GENERIC_REFERENCE_CHINESE.has(zh)) return true;
  // Forms such as 高廟 identify a ruler's temple, not the ruler's temple name.
  if (zh.endsWith('廟')) return true;
  return [name.en, name.pinyin]
    .map(normalizeLatinName)
    .some((value) => value && GENERIC_REFERENCE_ENGLISH.test(value));
}

function sharesNormalizedLatinName(left, right) {
  const leftValues = [left.en, left.pinyin].map(latinNameCore).filter(Boolean);
  const rightValues = new Set([right.en, right.pinyin].map(latinNameCore).filter(Boolean));
  return leftValues.some((value) => rightValues.has(value));
}

function isPreferredNameVariant(name, preferredName) {
  const nameZh = normalizeChineseName(name.zh);
  const preferredZh = normalizeChineseName(preferredName.zh);
  if (nameZh && preferredZh) {
    if (nameZh === preferredZh) return true;
    if (['temple', 'posthumous', 'regnal'].includes(publicNameFamily(name))) {
      const shorter = nameZh.length <= preferredZh.length ? nameZh : preferredZh;
      const longer = nameZh.length > preferredZh.length ? nameZh : preferredZh;
      if (shorter.length >= 2 && longer.length - shorter.length <= 2 && longer.endsWith(shorter)) return true;
    }
  }
  return sharesNormalizedLatinName(name, preferredName);
}

function aliasCandidateScore(name, family) {
  const sourceFamily = rawNameFamily(name);
  const exactSemanticKind = sourceFamily === family ? 40 : 0;
  const explicitNameKind = /(?:^|-)(?:name)$/u.test(String(name.kind ?? '')) ? 8 : 0;
  const completeness = Number(Boolean(name.en)) * 8 + Number(Boolean(name.zh)) * 8 + Number(Boolean(name.pinyin)) * 3;
  const evidence = Math.min(new Set(name.claimRefs ?? []).size, 20) * 2;
  const fullPersonalName = family === 'personal' && normalizeLatinName(name.en).includes(' ') ? 12 : 0;
  const fullPersonalNameChinese = family === 'personal'
    ? Math.min([...normalizeChineseName(name.zh)].length, 4) * 2
    : 0;
  const markedPinyin = /\p{Mark}/u.test(String(name.pinyin ?? '').normalize('NFD')) ? 2 : 0;
  return exactSemanticKind + explicitNameKind + completeness + evidence + fullPersonalName +
    fullPersonalNameChinese + markedPinyin;
}

function aliasTieBreaker(name) {
  return [name.en, name.zh, name.pinyin, name.kind].map((value) => String(value ?? '')).join('\u0000');
}

export function personPublicAliases(person, limit = MAX_PUBLIC_PERSON_ALIASES) {
  if (!Number.isInteger(limit) || limit < 0 || limit > MAX_PUBLIC_PERSON_ALIASES) {
    throw new Error(`Public person alias limit must be an integer from 0 to ${MAX_PUBLIC_PERSON_ALIASES}`);
  }
  const candidatesByFamily = new Map();
  for (const name of person.names ?? []) {
    if (![name.en, name.zh, name.pinyin].some((value) => String(value ?? '').trim())) continue;
    const family = publicNameFamily(name);
    if (!PUBLIC_ALIAS_FAMILIES.has(family) || isGenericReference(name) || isPreferredNameVariant(name, person.preferredName)) continue;
    const candidate = {
      kind: DISPLAY_KIND_BY_FAMILY.get(family),
      en: name.en ?? null,
      zh: name.zh ?? null,
      pinyin: name.pinyin ?? null,
      claimRefs: [...new Set(name.claimRefs ?? [])].sort(),
      family,
      score: aliasCandidateScore(name, family),
    };
    const current = candidatesByFamily.get(family);
    if (!current || candidate.score > current.score ||
        (candidate.score === current.score && aliasTieBreaker(candidate) < aliasTieBreaker(current))) {
      candidatesByFamily.set(family, candidate);
    }
  }
  return [...candidatesByFamily.values()]
    .sort((left, right) =>
      (ALIAS_FAMILY_PRIORITY.get(right.family) ?? 0) - (ALIAS_FAMILY_PRIORITY.get(left.family) ?? 0) ||
      right.score - left.score || aliasTieBreaker(left).localeCompare(aliasTieBreaker(right)))
    .slice(0, limit)
    .map(({ family, score, ...name }) => name);
}

export function personAlternateNames(person) {
  return personPublicAliases(person).map((name) => {
    const primary = name.en || name.pinyin || name.zh;
    return name.zh && name.zh !== primary ? `${primary} (${name.zh})` : primary;
  });
}
