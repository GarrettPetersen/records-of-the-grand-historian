const GENERIC_ZH = new Set([
  '太后',
  '皇太后',
  '皇后',
  '陛下',
  '天子',
  '帝',
  '王',
  '公',
  '臣',
  '妃',
  '夫人',
  '君',
  '主',
  '父',
  '母',
  '子',
  '女',
]);

const CAO_ALIASES = ['曹操', '魏武'];

export function chineseNames(person) {
  const names = new Set();
  for (const n of person?.names ?? []) {
    if (typeof n === 'string' && /[\u4e00-\u9fff]{2,}/.test(n)) names.add(n);
  }
  return [...names].sort((a, b) => b.length - a.length);
}

export function findPersonWitness({ personId, people, units, unitMap, unitPeople, surfaces, priorEvidenceByPerson }) {
  const prior = priorEvidenceByPerson.get(personId);
  if (prior?.length) {
    const lead = prior[0];
    if (unitMap.get(lead.unit)?.zh?.includes(lead.quote)) return { unit: lead.unit, quote: lead.quote, source: 'prior-check' };
  }

  const person = people.find((p) => p.id === personId);
  if (!person) return null;

  for (const name of chineseNames(person)) {
    for (const u of units) {
      if (u.zh?.includes(name)) return { unit: u.id, quote: name, source: 'packet-name' };
    }
  }

  if (person.names?.[0] === 'Cao Cao' || person.names?.[1] === '曹操') {
    for (const uid of ['s0007', 's0010', 's0121']) {
      const zh = unitMap.get(uid)?.zh ?? '';
      for (const alias of CAO_ALIASES) {
        if (zh.includes(alias)) return { unit: uid, quote: alias, source: 'wei-wu-alias' };
      }
    }
  }

  const zhRows = (surfaces ?? [])
    .filter((row) => row[0] === personId && (row[2] === 'zh' || /[\u4e00-\u9fff]/.test(String(row[3]))))
    .sort((a, b) => (b[3]?.length ?? 0) - (a[3]?.length ?? 0));

  for (const row of zhRows) {
    const quote = row[3];
    if (!quote || quote.length < 2 || GENERIC_ZH.has(quote)) continue;
    for (const [uid] of row[4] ?? []) {
      const zh = unitMap.get(uid)?.zh ?? '';
      if (zh.includes(quote)) return { unit: uid, quote, source: 'zh-surface' };
    }
  }

  const personUnits = Object.entries(unitPeople)
    .filter(([, ids]) => ids.includes(personId))
    .map(([uid]) => uid);

  for (const uid of personUnits) {
    for (const row of zhRows) {
      const quote = row[3];
      if (!quote || GENERIC_ZH.has(quote)) continue;
      const zh = unitMap.get(uid)?.zh ?? '';
      if (zh.includes(quote) && quote.length >= 2) return { unit: uid, quote, source: 'surface-on-owned-unit' };
    }
  }

  return null;
}

export function isGenericQuote(quote) {
  return GENERIC_ZH.has(quote);
}

export function hintVerdictForWitness({ hintItem, person, witness, unitMap }) {
  const hintText = hintItem.value?.[0] ?? '';
  const unitZh = unitMap.get(witness.unit)?.zh ?? '';
  const label = person?.names?.[0] ?? person?.id ?? 'person';
  const event = `Active-date hint for ${label}.`;

  if (isGenericQuote(witness.quote)) {
    return {
      verdict: 'research-blocked',
      event,
      reason: `The chapter names ${label} only with the undistinguished form「${witness.quote}」at ${witness.unit}, which does not verify this individual's active hint (${hintText}) against a personal citation.`,
    };
  }

  const hintHasPreciseYear = /(?:AD|BC)\s*\d{3,4}|Taishi|Taiyuan|Yonghe|太元|泰始|咸康|永和|太康|元康|永康|隆安|建元|兴宁|咸和|宁康|Xianhe|Shengping|Ningkang|\d{1,4}\s*BC/i.test(
    hintText,
  );
  const lineHasYear = /(?:AD|BC)?\s*\d{3,4}|泰始|太元|咸康|永和|太康|元康|永康|隆安|建元|兴宁|咸和|宁康|咸安|宁康|太安|光大|泰初|元熙|永和|興寧|咸康|太宗|公元前/.test(unitZh);

  if (/BC\s*\d|BC \d/.test(hintText) && !hintHasPreciseYear) {
    return {
      verdict: 'supported',
      event,
      reason: `${label} is cited by name at ${witness.unit}; the BC active hint is classical allusion framing and does not assert a Jin reign date on this line.`,
    };
  }

  if (hintHasPreciseYear && lineHasYear) {
    return {
      verdict: 'supported',
      event,
      reason: `Active hint (${hintText}) is consistent with explicit year or reign wording on ${witness.unit} where ${label} is named.`,
    };
  }

  if (hintHasPreciseYear && !lineHasYear) {
    return {
      verdict: 'research-blocked',
      event,
      reason: `${label} appears at ${witness.unit} in「${witness.quote}」but the line carries no reign or Western year matching the active hint (${hintText}).`,
    };
  }

  return {
    verdict: 'research-blocked',
    event,
    reason: `Named witness at ${witness.unit} does not establish the active hint interval (${hintText}) on the cited line; keep person mention only.`,
  };
}

export function chunkFindingItems(ids, size = 25) {
  const unique = [...new Set(ids)];
  const chunks = [];
  for (let i = 0; i < unique.length; i += size) chunks.push(unique.slice(i, i + size));
  return chunks;
}