import {
  exactSpanAt,
  setTranslationField,
} from './people-content.mjs';

const ENGLISH_SENTENCE_INITIAL_NON_NAMES = new Set([
  'All',
  'Among',
  'Construction',
  'Customs',
  'Even',
  'How',
  'Illness',
  'Is',
  'Investigation',
  'Not',
  'Once',
  'Only',
  'People',
  'Recently I',
  'Rites',
  'So-and-so',
  'Some',
  'Start',
  'Three',
  'Though',
  'Under',
  'What',
]);
const ENGLISH_FUNCTION_PHRASE_RE = /^(?:Am I|Even I|Though (?:He|I|It|She|That|These|They|This|Those|We))\b/u;
const ENGLISH_NAMED_NON_PERSON_TERMS = new Set([
  'Circular Moat',
  'Correct Month',
  'Earth Goddess',
  'Five Altars',
  'Forty-one Spiritual Terrace',
  'Heaven',
  "Heaven's Norm",
  'Imperial Ox',
  'Mount Shouyang',
  'Supreme Altar',
  'Three Amnesties',
  'Three Adjuncts',
  'Three Inquiries',
  'Three Pardons',
  "Wei's Henei",
  'Six Arts',
]);
const ENGLISH_NAMED_PLACE_TERMS = new Set([
  'Dragon City',
  'Fenyin',
  "Five Capitals'",
  'Hengcheng Gate',
  'Hong Terrace',
  'Hubei',
  'Mount Linlü',
  'Mount Yiwulü',
  'Salt Marsh',
  "Scholars' Grove",
  'Shannan East',
  'Yong',
  'Zhejiang',
]);
const ENGLISH_NAMED_ORGANIZATION_TERMS = new Set([
  'China Merchants Steam Navigation',
  "China Merchants'",
  'Company',
  "Divine Engine Corps'",
  "Eight Banners'",
  "Hanyang Ironworks'",
  'Imperial Academy',
  "Six Armies'",
  "Three Departments'",
  "Three Fathers'",
]);
const ENGLISH_COLLECTIVE_PERSON_TERMS = new Set([
  "Commoners'",
  "Five Hegemons'",
  "Five Lords'",
  "Five Emperors'",
  'Five Emperors’',
  "Five Thearchs'",
  'Five Thearchs’',
  "Former Kings'",
  "Northern Princes'",
  "Nine Ministers'",
  "Princes'",
  "Three Dukes'",
  "Three Feudatories'",
  "Three Kings'",
  'Three Kings’',
  "Three Sovereigns'",
  "Zhangs'",
  'Yujuelü',
]);
const ENGLISH_NAMED_POLITY_TERMS = new Set([
  "Central States'",
  'Eastern Yue',
  'Five Dynasties’',
  "Three Dynasties'",
]);
const ENGLISH_BOOK_TITLE_TERMS = new Set([
  "Annals'",
  "Autumn Annals'",
  "Five Parasites'",
  'Indignation',
  'Odes’',
  "Open Boxes'",
  'Preface',
  'Sorrow',
  'Testamentary Charge',
  "Zhou Offices'",
]);
const ENGLISH_NAMED_OFFICE_TERMS = new Set([
  'Broad Benefit Office',
  "Ceremonies'",
  'Champion',
  'Charging Cavalry',
  'Commander-in-Chief',
  'Direct Attendant',
  'Directors',
  'Education',
  'Flourishing Talent',
  'Gou Shield',
  'Grandee',
  'Household Grandee',
  "Imperial Rites'",
  'Imperial Sacrifices',
  "Imperial Sacrifices'",
  'Imperial Secretariat',
  'Imperial Stud',
  'Imperial Workshops',
  'Justice',
  'Khitan Yüehü',
  'Masses',
  'Middle Grandee',
  'Nobility Ranks',
  'Privy Treasurer',
  'Situ',
  'Splendid Light',
  'Supreme Pillar',
  'Three Commanders',
  'Three Preceptors',
  'Vice Supervisor',
]);
const ENGLISH_NOBLE_TITLE_TERMS = new Set([
  'Baron',
  'Prince',
]);
const ENGLISH_CONTEXTUAL_PERSON_TITLES = new Set([
  'Crown Prince',
  'Emperor',
  'Empress',
  'Empress Dowager',
  'Heir Apparent',
  'King',
  'Queen',
  'Regent',
]);
const ENGLISH_INSTITUTIONAL_SUFFIX_RE = /\b(?:Academy|Administration|Bureau|Chancellery|Commission|Court|Department|Directorate|Household|Ministry|Office|Pasturage|Secretariat)$/u;

function locatorKey(locator) {
  return `${locator.id}:${locator.blockIndex}:${locator.collection}:${locator.itemIndex}`;
}

export function removeDispositionMentionConflicts(extraction) {
  const mentionedCandidates = new Set(extraction.mentions.flatMap((mention) =>
    mention.candidateRefs
  ));
  extraction.candidateDispositions = extraction.candidateDispositions.filter((item) =>
    !mentionedCandidates.has(item.candidate)
  );
}

function claimEvidenceUnit(claim, unitId) {
  return claim.evidence.some((item) => item.endsWith(`:${unitId}`));
}

function mentionKindForNameKind(kind, fallback = 'personal-name') {
  if (kind === 'title') return 'title-reference';
  if (kind === 'personal') return 'personal-name';
  const allowed = new Set([
    'personal-name',
    'courtesy-name',
    'childhood-name',
    'religious-name',
    'temple-name',
    'posthumous-name',
    'alternate-name',
    'title-reference',
    'kinship-reference',
  ]);
  return allowed.has(kind) ? kind : fallback;
}

function aliasesForPerson(extraction, personId, language, unitId) {
  const aliases = new Map();
  const add = (exact, kind, preferred = false) => {
    if (typeof exact !== 'string' || !exact.trim()) return;
    const current = aliases.get(exact);
    if (!current || preferred) aliases.set(exact, { exact, kind, preferred });
    if (language === 'en') {
      const emperor = exact.match(/^([A-Z][a-z]+)di$/u);
      if (emperor) {
        const expanded = `Emperor ${emperor[1]}`;
        const expandedCurrent = aliases.get(expanded);
        if (!expandedCurrent || preferred) {
          aliases.set(expanded, { exact: expanded, kind, preferred });
        }
      }
    }
  };
  const person = extraction.people.find((item) => item.localId === personId);
  const hasUnitContext = extraction.claims.some((claim) =>
    claim.subject === personId && claimEvidenceUnit(claim, unitId)
  ) || extraction.mentions.some((mention) =>
    mention.person === personId && mention.unit.id === unitId
  );
  if (hasUnitContext) add(person?.preferredNameSuggestion?.[language], 'personal-name', true);
  for (const mention of extraction.mentions) {
    if (mention.person !== personId || mention.unit.id !== unitId) continue;
    for (const span of mention.spans[language]) add(span.exact, mention.kind);
  }
  for (const claim of extraction.claims) {
    if (
      claim.subject !== personId ||
      claim.predicate !== 'name' ||
      (!claimEvidenceUnit(claim, unitId) && !hasUnitContext)
    ) continue;
    add(claim.value?.[language], mentionKindForNameKind(claim.value?.kind));
  }
  for (const claim of extraction.claims) {
    if (
      claim.subject !== personId ||
      !claimEvidenceUnit(claim, unitId) ||
      (claim.predicate !== 'office' && claim.predicate !== 'noble-title')
    ) continue;
    add(claim.value?.title?.[language], 'title-reference');
  }
  return [...aliases.values()];
}

function exactOccurrences(text, exact, language = null) {
  const found = [];
  for (let occurrence = 0; ; occurrence += 1) {
    try {
      const span = exactSpanAt(text, exact, occurrence);
      if (language !== 'en') {
        found.push(span);
        continue;
      }
      const points = [...text];
      const exactPoints = [...exact];
      const startsWithWord = isWordCharacter(exactPoints[0]);
      const endsWithWord = isWordCharacter(exactPoints.at(-1));
      const before = points[span.startCodePoint - 1];
      const after = points[span.endCodePoint];
      if (
        (!startsWithWord || !isWordCharacter(before)) &&
        (!endsWithWord || !isWordCharacter(after))
      ) {
        found.push(span);
      }
    } catch {
      break;
    }
  }
  return found;
}

function caseInsensitiveExactOccurrences(text, exact) {
  const foldedText = text.toLocaleLowerCase('en-US');
  const foldedExact = exact.toLocaleLowerCase('en-US');
  const found = [];
  for (let index = foldedText.indexOf(foldedExact); index >= 0; index = foldedText.indexOf(foldedExact, index + 1)) {
    const actual = text.slice(index, index + exact.length);
    const before = [...text.slice(0, index)].at(-1);
    const after = [...text.slice(index + exact.length)][0];
    if (
      actual.toLocaleLowerCase('en-US') === foldedExact &&
      (!isWordCharacter([...actual][0]) || !isWordCharacter(before)) &&
      (!isWordCharacter([...actual].at(-1)) || !isWordCharacter(after))
    ) {
      const startCodePoint = [...text.slice(0, index)].length;
      found.push({
        exact: actual,
        occurrence: found.length,
        startCodePoint,
        endCodePoint: startCodePoint + [...actual].length,
      });
    }
  }
  return found;
}

function tokenSpans(text) {
  const spans = [];
  const pattern = /\p{Script=Han}|[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*|[^\s\p{L}\p{N}]/gu;
  for (const match of text.matchAll(pattern)) {
    const startCodePoint = [...text.slice(0, match.index)].length;
    const exact = match[0];
    spans.push({
      exact,
      startCodePoint,
      endCodePoint: startCodePoint + [...exact].length,
    });
  }
  return spans;
}

function resolvedOldSpan(text, span) {
  const points = [...text];
  if (
    Number.isInteger(span.startCodePoint) &&
    Number.isInteger(span.endCodePoint) &&
    points.slice(span.startCodePoint, span.endCodePoint).join('') === span.exact
  ) {
    return { startCodePoint: span.startCodePoint, endCodePoint: span.endCodePoint };
  }
  return exactOccurrences(text, span.exact)[span.occurrence ?? 0] ?? null;
}

function plausibleReplacement(oldExact, replacement, language) {
  if (!replacement || replacement.length > Math.max(80, [...oldExact].length * 5)) return false;
  if (language !== 'en') return true;
  if (/[\p{L}\p{N}]/u.test(oldExact) && !/[\p{L}\p{N}]/u.test(replacement)) return false;
  if (
    /^\p{Lu}/u.test(oldExact) &&
    !/^[\p{Lu}][\p{L}\p{M}'’-]*(?:[ \t]+(?:(?:al|bin|bint|ibn|of|the)|[\p{Lu}][\p{L}\p{M}'’-]*)){0,5}$/u.test(replacement)
  ) return false;
  return true;
}

// A reviewed repair may change a person's printed name while also changing other
// words in the same sentence. Relocate the old span between the nearest unchanged
// tokens so exact person links survive both edits without guessing an identity.
export function remapMentionSpanThroughEdit(span, oldText, newText, language) {
  const oldLocation = resolvedOldSpan(oldText, span);
  if (!oldLocation || oldText === newText) return null;

  if (language === 'en') {
    const caseOnlyMatches = caseInsensitiveExactOccurrences(newText, span.exact);
    if (caseOnlyMatches.length === 1) return caseOnlyMatches[0];
  }

  const oldTokens = tokenSpans(oldText);
  const left = oldTokens
    .filter((token) => token.endCodePoint <= oldLocation.startCodePoint)
    .slice(-6)
    .reverse();
  const right = oldTokens
    .filter((token) => token.startCodePoint >= oldLocation.endCodePoint)
    .slice(0, 6);
  const newPoints = [...newText];
  const oldPoints = [...oldText];
  const leftAnchors = left.flatMap((token, distance) =>
    exactOccurrences(newText, token.exact).map((found) => ({ token, found, distance }))
  );
  const rightAnchors = right.flatMap((token, distance) =>
    exactOccurrences(newText, token.exact).map((found) => ({ token, found, distance }))
  );
  if (oldLocation.startCodePoint === 0) {
    leftAnchors.push({
      token: { exact: '', startCodePoint: 0, endCodePoint: 0 },
      found: { exact: '', startCodePoint: 0, endCodePoint: 0 },
      distance: 0,
    });
  }
  if (oldLocation.endCodePoint === oldPoints.length) {
    rightAnchors.push({
      token: { exact: '', startCodePoint: oldPoints.length, endCodePoint: oldPoints.length },
      found: { exact: '', startCodePoint: newPoints.length, endCodePoint: newPoints.length },
      distance: 0,
    });
  }
  if (leftAnchors.length === 0 || rightAnchors.length === 0) return null;

  const candidates = [];
  for (const leftAnchor of leftAnchors) {
    for (const rightAnchor of rightAnchors) {
      if (leftAnchor.found.endCodePoint > rightAnchor.found.startCodePoint) continue;
      let startCodePoint = leftAnchor.found.endCodePoint;
      let endCodePoint = rightAnchor.found.startCodePoint;
      while (startCodePoint < endCodePoint && /\s/u.test(newPoints[startCodePoint])) startCodePoint += 1;
      while (endCodePoint > startCodePoint && /\s/u.test(newPoints[endCodePoint - 1])) endCodePoint -= 1;
      const exact = newPoints.slice(startCodePoint, endCodePoint).join('');
      if (!plausibleReplacement(span.exact, exact, language)) continue;

      const oldLeftGap = oldLocation.startCodePoint - leftAnchor.token.endCodePoint;
      const oldRightGap = rightAnchor.token.startCodePoint - oldLocation.endCodePoint;
      const newLeftGap = startCodePoint - leftAnchor.found.endCodePoint;
      const newRightGap = rightAnchor.found.startCodePoint - endCodePoint;
      const expectedStart = oldLocation.startCodePoint * newPoints.length / Math.max(1, oldPoints.length);
      const score =
        1000 -
        80 * (leftAnchor.distance + rightAnchor.distance) +
        5 * ([...leftAnchor.token.exact].length + [...rightAnchor.token.exact].length) -
        3 * (Math.abs(newLeftGap - oldLeftGap) + Math.abs(newRightGap - oldRightGap)) -
        Math.abs([...exact].length - [...span.exact].length) -
        Math.abs(startCodePoint - expectedStart) / 10;
      candidates.push({ exact, startCodePoint, endCodePoint, score });
    }
  }
  candidates.sort((a, b) =>
    b.score - a.score ||
    a.startCodePoint - b.startCodePoint ||
    a.endCodePoint - b.endCodePoint
  );
  const selected = candidates[0];
  if (!selected) return null;
  const tied = candidates.some((candidate, index) =>
    index > 0 &&
    Math.abs(candidate.score - selected.score) < 0.001 &&
    (candidate.startCodePoint !== selected.startCodePoint || candidate.endCodePoint !== selected.endCodePoint)
  );
  if (tied) return null;
  const occurrences = exactOccurrences(newText, selected.exact, language);
  const occurrence = occurrences.findIndex((candidate) =>
    candidate.startCodePoint === selected.startCodePoint && candidate.endCodePoint === selected.endCodePoint
  );
  if (occurrence < 0) return null;
  return {
    exact: selected.exact,
    occurrence,
    startCodePoint: selected.startCodePoint,
    endCodePoint: selected.endCodePoint,
  };
}

function wordSet(value) {
  return new Set(value.toLocaleLowerCase('en-US').match(/[\p{L}\p{N}]+/gu) ?? []);
}

function sharedWordCount(left, right) {
  const rightWords = wordSet(right);
  return [...wordSet(left)].filter((word) => rightWords.has(word)).length;
}

function nestedStringValues(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(nestedStringValues);
  if (value && typeof value === 'object') return Object.values(value).flatMap(nestedStringValues);
  return [];
}

function candidateMatchesClaimValue(extraction, candidate, predicate) {
  return extraction.claims.some((claim) =>
    claim.predicate === predicate &&
    claimEvidenceUnit(claim, candidate.unit) &&
    nestedStringValues(claim.value).some((value) =>
      surfaceContains(value.toLocaleLowerCase('en-US'), candidate.exact.toLocaleLowerCase('en-US'), 'en')
    )
  );
}

function candidateMatchesNamedTitleClaim(extraction, candidate) {
  return extraction.claims.some((claim) =>
    (
      ['honor', 'noble-title'].includes(claim.predicate) ||
      (claim.predicate === 'name' && claim.value?.kind === 'title')
    ) &&
    claimEvidenceUnit(claim, candidate.unit) &&
    nestedStringValues(claim.value).some((value) =>
      typeof value === 'string' &&
      surfaceContains(value.toLocaleLowerCase('en-US'), candidate.exact.toLocaleLowerCase('en-US'), 'en')
    )
  );
}

function candidateMatchesPlaceClaim(extraction, candidate) {
  return extraction.claims.some((claim) =>
    claimEvidenceUnit(claim, candidate.unit) &&
    nestedStringValues(
      ['native-place', 'place-association'].includes(claim.predicate)
        ? claim.value
        : claim.value?.place
    ).some((value) =>
      typeof value === 'string' &&
      surfaceContains(value.toLocaleLowerCase('en-US'), candidate.exact.toLocaleLowerCase('en-US'), 'en')
    )
  );
}

function isWordCharacter(value) {
  return typeof value === 'string' && /[\p{L}\p{N}]/u.test(value);
}

function surfaceContains(container, surface, language) {
  if (language === 'zh') return container.includes(surface);
  for (let index = container.indexOf(surface); index >= 0; index = container.indexOf(surface, index + 1)) {
    const before = [...container.slice(0, index)].at(-1);
    const after = [...container.slice(index + surface.length)][0];
    if (!isWordCharacter(before) && !isWordCharacter(after)) return true;
  }
  return false;
}

function spansOverlap(left, right) {
  return left.startCodePoint < right.endCodePoint && right.startCodePoint < left.endCodePoint;
}

function coveringSpan(text, left, right) {
  const startCodePoint = Math.min(left.startCodePoint, right.startCodePoint);
  const endCodePoint = Math.max(left.endCodePoint, right.endCodePoint);
  const exact = [...text].slice(startCodePoint, endCodePoint).join('');
  const span = exactOccurrences(text, exact).find((item) => item.startCodePoint === startCodePoint);
  if (!span) throw new Error(`Could not rebuild covering span ${JSON.stringify(exact)}`);
  return span;
}

function glossaryIds(candidate) {
  return new Set(candidate.detectors.flatMap((detector) =>
    Number.isInteger(detector.glossaryId) ? [detector.glossaryId] : []
  ));
}

function sharedGlossaryEntry(left, right) {
  const leftIds = glossaryIds(left);
  return leftIds.size > 0 && [...glossaryIds(right)].some((id) => leftIds.has(id));
}

function candidateExpandedSpan(aliasSpan, unitId, language, candidates) {
  const enclosing = candidates.filter((candidate) =>
    candidate.unit === unitId &&
    candidate.language === language &&
    candidate.startCodePoint <= aliasSpan.startCodePoint &&
    candidate.endCodePoint >= aliasSpan.endCodePoint
  );
  if (enclosing.length === 0) return aliasSpan;
  enclosing.sort((left, right) =>
    (right.endCodePoint - right.startCodePoint) - (left.endCodePoint - left.startCodePoint)
  );
  const candidate = enclosing[0];
  return {
    exact: candidate.exact,
    occurrence: candidate.occurrence,
    startCodePoint: candidate.startCodePoint,
    endCodePoint: candidate.endCodePoint,
    unitTextHash: aliasSpan.unitTextHash,
  };
}

function unitLocator(unit) {
  return {
    id: unit.id,
    kind: unit.kind,
    blockIndex: unit.blockIndex,
    collection: unit.collection,
    itemIndex: unit.itemIndex,
  };
}

function addAliasMention(extraction, unit, person, language, kind, span) {
  const overlaps = extraction.mentions.some((mention) =>
    mention.unit.id === unit.id && mention.spans[language].some((current) => spansOverlap(current, span))
  );
  if (overlaps) return false;
  extraction.mentions.push({
    id: `${extraction.book}:${extraction.chapter}:m9999`,
    person,
    unit: unitLocator(unit),
    kind,
    spans: {
      zh: language === 'zh' ? [span] : [],
      en: language === 'en' ? [span] : [],
    },
    candidateRefs: [],
  });
  return true;
}

function addInferredNameClaim(extraction, person, unitId, kind, exact) {
  if (extraction.claims.some((claim) =>
    claim.subject === person &&
    claim.predicate === 'name' &&
    claim.value?.en === exact
  )) return;
  extraction.claims.push({
    id: `${extraction.book}:${extraction.chapter}:c-reconciled-${extraction.claims.length + 1}`,
    subject: person,
    predicate: 'name',
    value: { kind, en: exact },
    certainty: 'strongly-inferred',
    evidence: [`${extraction.book}:${extraction.chapter}:${unitId}`],
  });
}

function addLeadingParentheticalAlias(extraction, candidate, unit) {
  if (candidate.language !== 'en') return false;
  const points = [...unit.en];
  if (!/^\s*\(/u.test(points.slice(candidate.endCodePoint).join(''))) return false;
  const following = extraction.mentions.flatMap((mention) =>
    mention.unit.id === unit.id
      ? mention.spans.en
        .filter((span) =>
          /^\s*\($/u.test(points.slice(candidate.endCodePoint, span.startCodePoint).join('')) &&
          /^\)/u.test(points.slice(span.endCodePoint).join(''))
        )
        .map((span) => ({ mention, span }))
      : []
  );
  const nearestStart = Math.min(Number.MAX_SAFE_INTEGER, ...following.map(({ span }) => span.startCodePoint));
  const nearest = following.filter(({ span }) => span.startCodePoint === nearestStart);
  const people = new Set(nearest.map(({ mention }) => mention.person));
  if (people.size !== 1) return false;

  const person = [...people][0];
  const followingSpan = nearest[0].span;
  const nameClaim = extraction.claims.find((claim) =>
    claim.subject === person &&
    claim.predicate === 'name' &&
    claimEvidenceUnit(claim, unit.id) &&
    claim.value?.en === followingSpan.exact
  );
  const kind = mentionKindForNameKind(nameClaim?.value?.kind, nearest[0].mention.kind);
  const span = exactSpanAt(unit.en, candidate.exact, candidate.occurrence);
  if (!addAliasMention(extraction, unit, person, 'en', kind, span)) return false;
  extraction.mentions.at(-1).candidateRefs.push(candidate.id);
  addInferredNameClaim(extraction, person, unit.id, kind, candidate.exact);
  return true;
}

function addPosthumousNameCandidate(extraction, candidate, unit) {
  if (candidate.language !== 'en') return false;
  const before = [...unit.en].slice(0, candidate.startCodePoint).join('');
  if (!/\bposthumous name\s+$/iu.test(before)) return false;
  const subjects = new Set([
    ...extraction.claims
      .filter((claim) =>
        claim.predicate === 'honor' &&
        claim.value?.action === 'posthumous-name' &&
        claimEvidenceUnit(claim, unit.id)
      )
      .map((claim) => claim.subject),
    ...extraction.mentions
      .filter((mention) => mention.unit.id === unit.id && mention.kind === 'posthumous-name')
      .map((mention) => mention.person),
  ]);
  if (subjects.size !== 1) return false;
  const person = [...subjects][0];
  const span = exactSpanAt(unit.en, candidate.exact, candidate.occurrence);
  if (!addAliasMention(extraction, unit, person, 'en', 'posthumous-name', span)) return false;
  extraction.mentions.at(-1).candidateRefs.push(candidate.id);
  addInferredNameClaim(extraction, person, unit.id, 'posthumous-name', candidate.exact);
  return true;
}

function renumberMentions(extraction) {
  extraction.mentions.sort((left, right) => {
    const leftSpan = [...left.spans.zh, ...left.spans.en][0];
    const rightSpan = [...right.spans.zh, ...right.spans.en][0];
    return left.unit.blockIndex - right.unit.blockIndex ||
      left.unit.itemIndex - right.unit.itemIndex ||
      left.unit.id.localeCompare(right.unit.id) ||
      (leftSpan?.startCodePoint ?? 0) - (rightSpan?.startCodePoint ?? 0) ||
      left.person.localeCompare(right.person);
  });
  for (const [index, mention] of extraction.mentions.entries()) {
    mention.id = `${extraction.book}:${extraction.chapter}:m${String(index + 1).padStart(4, '0')}`;
  }
}

function remapNestedPersonIds(value, personIdMap) {
  if (typeof value === 'string') return personIdMap.get(value) ?? value;
  if (Array.isArray(value)) return value.map((item) => remapNestedPersonIds(item, personIdMap));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [
      key,
      remapNestedPersonIds(item, personIdMap),
    ]));
  }
  return value;
}

function renumberPeopleAndClaims(extraction) {
  const namespace = `${extraction.book}:${extraction.chapter}`;
  const personIdMap = new Map(extraction.people.map((person, index) => [
    person.localId,
    `${namespace}:p${String(index + 1).padStart(3, '0')}`,
  ]));
  extraction.people = extraction.people.map((person) => ({
    ...person,
    localId: personIdMap.get(person.localId),
    identityHints: {
      ...person.identityHints,
      relatedLocalPeople: person.identityHints.relatedLocalPeople.flatMap((id) =>
        personIdMap.has(id) ? [personIdMap.get(id)] : []
      ),
    },
  }));
  extraction.mentions = extraction.mentions.map((mention) => ({
    ...mention,
    person: personIdMap.get(mention.person) ?? mention.person,
  }));
  extraction.claims = extraction.claims.map((claim, index) => ({
    ...claim,
    id: `${namespace}:c${String(index + 1).padStart(4, '0')}`,
    subject: personIdMap.get(claim.subject) ?? claim.subject,
    value: remapNestedPersonIds(claim.value, personIdMap),
  }));
}

export function applyTranslationRepairs(chapter, repairs) {
  const revised = structuredClone(chapter);
  const changedUnits = new Set();
  const changedFields = new Set();

  for (const repair of repairs) {
    if (repair.status !== 'proposed') {
      throw new Error(`${repair.id} must be proposed before it can be applied`);
    }
    const fieldKey = `${locatorKey(repair.unit)}:${repair.field}`;
    if (changedFields.has(fieldKey)) throw new Error(`${repair.id} duplicates repair target ${fieldKey}`);
    changedFields.add(fieldKey);
    setTranslationField(revised, repair.unit, repair.field, repair.before, repair.after);
    changedUnits.add(repair.unit.id);
  }

  return { chapter: revised, changedUnits };
}

function normalizeMentionSpans(mention, unit, staleSpans) {
  const normalized = structuredClone(mention);
  for (const language of ['zh', 'en']) {
    normalized.spans[language] = normalized.spans[language].flatMap((span) => {
      const occurrences = exactOccurrences(unit[language], span.exact, language);
      if (occurrences.length === 0) {
        staleSpans.push({ mention, language, span });
        return [];
      }
      if (!Number.isInteger(span.startCodePoint)) {
        const occurrence = occurrences[span.occurrence];
        if (occurrence) return [occurrence];
        staleSpans.push({ mention, language, span });
        return [];
      }
      occurrences.sort((left, right) =>
        Math.abs(left.startCodePoint - span.startCodePoint) -
          Math.abs(right.startCodePoint - span.startCodePoint) ||
        left.startCodePoint - right.startCodePoint
      );
      return [occurrences[0]];
    });
  }
  return normalized;
}

function removeRedundantSamePersonSpans(mentions, candidateById = new Map()) {
  for (const language of ['zh', 'en']) {
    const located = mentions.flatMap((mention) => mention.spans[language].map((span) => ({
      mention,
      span,
      length: span.endCodePoint - span.startCodePoint,
    })));
    for (const current of located) {
      const covering = located.find((other) =>
        other !== current &&
        other.mention.person === current.mention.person &&
        other.mention.unit.id === current.mention.unit.id &&
        other.span.startCodePoint <= current.span.startCodePoint &&
        other.span.endCodePoint >= current.span.endCodePoint &&
        (other.length > current.length ||
          (other.length === current.length && other.mention.id < current.mention.id))
      );
      if (!covering) continue;
      const transferredCandidateRefs = current.mention.candidateRefs.filter((candidateId) => {
        const candidate = candidateById.get(candidateId);
        return candidate?.language === language &&
          covering.span.startCodePoint <= candidate.startCodePoint &&
          candidate.endCodePoint <= covering.span.endCodePoint;
      });
      covering.mention.candidateRefs.push(...transferredCandidateRefs);
      current.mention.candidateRefs = current.mention.candidateRefs.filter((candidateId) =>
        !transferredCandidateRefs.includes(candidateId)
      );
      current.mention.spans[language] = current.mention.spans[language]
        .filter((span) => span !== current.span);
    }
  }
}

function coalesceOverlappingMentionSpans(mention, unit) {
  for (const language of ['zh', 'en']) {
    const ordered = [...mention.spans[language]].sort((left, right) =>
      left.startCodePoint - right.startCodePoint || left.endCodePoint - right.endCodePoint
    );
    const coalesced = [];
    for (const span of ordered) {
      const previous = coalesced.at(-1);
      if (!previous || !spansOverlap(previous, span)) {
        coalesced.push(span);
        continue;
      }
      coalesced[coalesced.length - 1] = coveringSpan(unit[language], previous, span);
    }
    mention.spans[language] = coalesced;
  }
}

function candidateInsideMention(candidate, mention) {
  return mention.unit.id === candidate.unit && mention.spans[candidate.language].some((span) =>
    span.startCodePoint <= candidate.startCodePoint && span.endCodePoint >= candidate.endCodePoint
  );
}

function candidateEnclosesMention(candidate, mention) {
  return mention.unit.id === candidate.unit && mention.spans[candidate.language].some((span) =>
    candidate.startCodePoint <= span.startCodePoint && candidate.endCodePoint >= span.endCodePoint
  );
}

function isStoredEnglishSubwordSpan(span, previousUnit) {
  if (!previousUnit) return false;
  const points = [...previousUnit.en];
  const exactPoints = [...span.exact];
  return Number.isInteger(span.startCodePoint) &&
    Number.isInteger(span.endCodePoint) &&
    points.slice(span.startCodePoint, span.endCodePoint).join('') === span.exact &&
    (
      (isWordCharacter(exactPoints[0]) && isWordCharacter(points[span.startCodePoint - 1])) ||
      (isWordCharacter(exactPoints.at(-1)) && isWordCharacter(points[span.endCodePoint]))
    );
}

function isStoredEnglishSubword(stale, previousUnit) {
  return stale.language === 'en' && isStoredEnglishSubwordSpan(stale.span, previousUnit);
}

function shortenedNameCandidate(stale, revisedPacket) {
  if (stale.language !== 'en') return null;
  const matches = revisedPacket.preflight.candidates.filter((candidate) =>
    candidate.unit === stale.mention.unit.id &&
    candidate.language === 'en' &&
    (
      stale.span.exact.startsWith(`${candidate.exact} `) ||
      stale.span.exact.endsWith(` ${candidate.exact}`)
    )
  );
  return matches.length === 1 ? matches[0] : null;
}

export function reconcileExtractionAfterRepairs(extraction, revisedPacket, options = {}) {
  const reconciled = structuredClone(extraction);
  const candidateOrder = new Map(
    revisedPacket.preflight.candidates.map((candidate, index) => [candidate.id, index]),
  );
  const candidateById = new Map(
    revisedPacket.preflight.candidates.map((candidate) => [candidate.id, candidate]),
  );
  const validCandidateIds = new Set(candidateOrder.keys());
  const previousCandidateById = new Map(
    (options.previousPacket?.preflight?.candidates ?? []).map((candidate) => [candidate.id, candidate]),
  );
  const previousUnitById = new Map(
    (options.previousPacket?.units ?? []).map((unit) => [unit.id, unit]),
  );
  const unitById = new Map(revisedPacket.units.map((unit) => [unit.id, unit]));
  const staleSpans = [];
  const invalidSubwordContexts = new Set();

  reconciled.input = structuredClone(revisedPacket.input);
  if (options.markRepairsApplied !== false) {
    reconciled.translationRepairs = reconciled.translationRepairs.map((repair) => ({
      ...repair,
      status: 'applied',
    }));
  }
  for (const mention of reconciled.mentions) {
    const previousUnit = previousUnitById.get(mention.unit.id);
    mention.spans.en = mention.spans.en.filter((span) => {
      if (!isStoredEnglishSubwordSpan(span, previousUnit)) return true;
      invalidSubwordContexts.add(`${mention.person}\u0000${mention.unit.id}`);
      return false;
    });
  }
  reconciled.mentions = reconciled.mentions.map((mention) => {
    const unit = unitById.get(mention.unit.id);
    if (!unit) return mention;
    return normalizeMentionSpans(mention, unit, staleSpans);
  });
  for (const mention of reconciled.mentions) {
    const unit = unitById.get(mention.unit.id);
    if (!unit || mention.kind !== 'title-reference' || mention.spans.en.length > 0) continue;
    mention.spans.zh = mention.spans.zh.filter((span) => {
      if (span.exact !== '上') return true;
      const after = [...unit.zh].slice(span.endCodePoint).join('');
      return !/^所/u.test(after);
    });
  }
  removeRedundantSamePersonSpans(reconciled.mentions, candidateById);

  for (const mention of reconciled.mentions) {
    mention.candidateRefs = [];
  }
  const previousDispositions = structuredClone(reconciled.candidateDispositions);
  reconciled.candidateDispositions = reconciled.candidateDispositions.filter((item) =>
    validCandidateIds.has(item.candidate)
  );

  const unresolvedSpans = [];
  const orphanedStalePeople = new Set();
  for (const stale of staleSpans) {
    const unit = unitById.get(stale.mention.unit.id);
    if (!unit) {
      unresolvedSpans.push(stale);
      continue;
    }
    const previousUnit = previousUnitById.get(stale.mention.unit.id);
    let mapped = false;
    if (isStoredEnglishSubword(stale, previousUnit)) {
      invalidSubwordContexts.add(`${stale.mention.person}\u0000${stale.mention.unit.id}`);
      mapped = true;
    }
    const shortenedCandidate = !mapped && shortenedNameCandidate(stale, revisedPacket);
    if (shortenedCandidate) {
      const targetMention = reconciled.mentions.find((mention) =>
        mention.id === stale.mention.id && mention.person === stale.mention.person
      );
      if (targetMention) {
        targetMention.spans.en.push(exactSpanAt(
          unit.en,
          shortenedCandidate.exact,
          shortenedCandidate.occurrence,
        ));
        targetMention.candidateRefs.push(shortenedCandidate.id);
        mapped = true;
      }
    }
    const aliases = aliasesForPerson(
      reconciled,
      stale.mention.person,
      stale.language,
      stale.mention.unit.id,
    ).flatMap((alias) => exactOccurrences(unit[stale.language], alias.exact, stale.language)
      .map((span) => ({ alias, span })));
    const scored = aliases.map((item) => ({
      ...item,
      sharedWords: sharedWordCount(stale.span.exact, item.alias.exact),
    }));
    const bestSharedWordCount = Math.max(0, ...scored.map((item) => item.sharedWords));
    const preferred = scored.filter((item) => item.alias.preferred);
    const selected = bestSharedWordCount > 0
      ? scored.filter((item) => item.sharedWords === bestSharedWordCount)
      : preferred.length > 0 ? preferred : scored;
    for (const { alias, span } of selected) {
      if (mapped) break;
      const expanded = candidateExpandedSpan(
        span,
        unit.id,
        stale.language,
        revisedPacket.preflight.candidates,
      );
      const alreadyCoveredByPerson = reconciled.mentions.some((mention) =>
        mention.id !== stale.mention.id &&
        mention.person === stale.mention.person &&
        mention.unit.id === unit.id &&
        mention.spans[stale.language].some((current) =>
          current.startCodePoint <= expanded.startCodePoint &&
          current.endCodePoint >= expanded.endCodePoint
        )
      );
      if (alreadyCoveredByPerson) {
        mapped = true;
        continue;
      }
      const targetMention = reconciled.mentions.find((mention) =>
        mention.id === stale.mention.id && mention.person === stale.mention.person
      );
      const conflicts = reconciled.mentions.some((mention) =>
        mention.person !== stale.mention.person &&
        mention.unit.id === unit.id &&
        mention.spans[stale.language].some((current) => spansOverlap(current, expanded))
      );
      if (targetMention && !conflicts) {
        const alreadyOnTarget = targetMention.spans[stale.language].some((current) =>
          current.startCodePoint === expanded.startCodePoint &&
          current.endCodePoint === expanded.endCodePoint
        );
        if (!alreadyOnTarget) targetMention.spans[stale.language].push(expanded);
        mapped = true;
        continue;
      }
      const added = addAliasMention(
        reconciled,
        unit,
        stale.mention.person,
        stale.language,
        alias.kind,
        expanded,
      );
      const alreadyCovered = reconciled.mentions.some((mention) =>
        mention.person === stale.mention.person &&
        mention.unit.id === unit.id &&
        mention.spans[stale.language].some((current) =>
          current.startCodePoint <= expanded.startCodePoint &&
          current.endCodePoint >= expanded.endCodePoint
        )
      );
      mapped = added || alreadyCovered || mapped;
    }
    if (!mapped) {
      const replacement = previousUnit && remapMentionSpanThroughEdit(
        stale.span,
        previousUnit[stale.language],
        unit[stale.language],
        stale.language,
      );
      if (replacement) {
        const conflicts = reconciled.mentions.some((mention) =>
          mention.person !== stale.mention.person &&
          mention.unit.id === unit.id &&
          mention.spans[stale.language].some((current) => spansOverlap(current, replacement))
        );
        const targetMention = reconciled.mentions.find((mention) =>
          mention.id === stale.mention.id && mention.person === stale.mention.person
        );
        if (!conflicts && targetMention) {
          targetMention.spans[stale.language].push(replacement);
          mapped = true;
        }
      }
    }
    if (!mapped && stale.language === 'en' && !stale.span.exact.endsWith('s')) {
      const pluralSpans = exactOccurrences(unit.en, `${stale.span.exact}s`, 'en');
      const targetMention = reconciled.mentions.find((mention) =>
        mention.id === stale.mention.id && mention.person === stale.mention.person
      );
      if (pluralSpans.length === 1 && targetMention) {
        targetMention.spans.en.push(pluralSpans[0]);
        mapped = true;
      }
    }
    if (!mapped && stale.language === 'en') {
      const previousUnit = previousUnitById.get(stale.mention.unit.id);
      const wasNeverDisplayText = previousUnit &&
        exactOccurrences(previousUnit.en, stale.span.exact, 'en').length === 0 &&
        exactOccurrences(previousUnit.literal, stale.span.exact, 'en').length > 0;
      if (wasNeverDisplayText) {
        // Extraction spans link the displayed idiomatic text. A literal-only
        // surface was mis-scoped by the worker and should not become a link.
        mapped = true;
      }
    }
    if (!mapped && stale.language === 'en') {
      const previousUnit = previousUnitById.get(stale.mention.unit.id);
      const removedFromDisplay = previousUnit &&
        exactOccurrences(previousUnit.en, stale.span.exact, 'en').length > 0 &&
        exactOccurrences(unit.en, stale.span.exact, 'en').length === 0;
      const supportedElsewhere = reconciled.mentions.some((mention) =>
        mention.id !== stale.mention.id &&
        mention.person === stale.mention.person &&
        (mention.spans.zh.length > 0 || mention.spans.en.length > 0)
      ) || reconciled.claims.some((claim) =>
        claim.subject === stale.mention.person &&
        !claimEvidenceUnit(claim, stale.mention.unit.id)
      );
      if (removedFromDisplay && supportedElsewhere) {
        // The reviewed edit removed a fabricated explicit name but the person
        // remains supported elsewhere. Contextual claims in this unit may
        // still be valid even though this particular link is retired.
        mapped = true;
      }
    }
    if (!mapped) {
      const hasRemainingUnitContext = reconciled.mentions.some((mention) =>
        mention.person === stale.mention.person &&
        mention.unit.id === stale.mention.unit.id &&
        (mention.spans.zh.length > 0 || mention.spans.en.length > 0)
      ) || reconciled.claims.some((claim) =>
        claim.subject === stale.mention.person &&
        claimEvidenceUnit(claim, stale.mention.unit.id)
      );
      const hasRemainingMention = reconciled.mentions.some((mention) =>
        mention.person === stale.mention.person &&
        (mention.spans.zh.length > 0 || mention.spans.en.length > 0)
      );
      const hasRemainingClaim = reconciled.claims.some((claim) =>
        claim.subject === stale.mention.person
      );
      if (!hasRemainingMention && !hasRemainingClaim) {
        orphanedStalePeople.add(stale.mention.person);
      } else if (hasRemainingUnitContext) {
        unresolvedSpans.push(stale);
      }
    }
  }
  reconciled.claims = reconciled.claims.filter((claim) => {
    if (claim.predicate !== 'attestation' || claim.evidence.length !== 1) return true;
    const unitId = claim.evidence[0].split(':').at(-1);
    if (!invalidSubwordContexts.has(`${claim.subject}\u0000${unitId}`)) return true;
    return reconciled.mentions.some((mention) =>
      mention.person === claim.subject &&
      mention.unit.id === unitId &&
      (mention.spans.zh.length > 0 || mention.spans.en.length > 0)
    );
  });
  reconciled.mentions = reconciled.mentions.filter((mention) =>
    mention.spans.zh.length > 0 || mention.spans.en.length > 0
  );
  const activePersonIds = new Set(reconciled.mentions.map((mention) => mention.person));
  for (const claim of reconciled.claims) {
    activePersonIds.add(claim.subject);
    for (const value of nestedStringValues(claim.value)) {
      if (reconciled.people.some((person) => person.localId === value)) activePersonIds.add(value);
    }
  }
  reconciled.people = reconciled.people.filter((person) =>
    !orphanedStalePeople.has(person.localId) || activePersonIds.has(person.localId)
  );

  const accounted = new Set(reconciled.candidateDispositions.map((item) => item.candidate));
  const knownPolities = new Set(reconciled.people.flatMap((person) =>
    person.identityHints.polityHints ?? []
  ));
  const knownReignPeriods = new Set();
  for (const unit of revisedPacket.units) {
    for (const text of [unit.en, unit.literal]) {
      for (const match of text.matchAll(/\b([A-Z][\p{L}'’-]*)[ \t]+era\b/gu)) {
        knownReignPeriods.add(match[1]);
      }
      for (const match of text.matchAll(
        /\b(?:in|of)[ \t]+([A-Z][\p{L}'’-]*)[ \t]+(?:year[ \t]+\d+|\d+)\b/gu,
      )) {
        knownReignPeriods.add(match[1]);
      }
    }
  }

  const unresolvedCandidates = [];
  for (const candidate of revisedPacket.preflight.candidates) {
    if (accounted.has(candidate.id)) continue;
    const remappedPriorDispositions = previousDispositions.filter((disposition) => {
      const previous = previousCandidateById.get(disposition.candidate);
      if (
        !previous ||
        previous.unit !== candidate.unit ||
        previous.language !== candidate.language
      ) return false;
      const previousUnit = previousUnitById.get(previous.unit);
      const revisedUnit = unitById.get(candidate.unit);
      if (!previousUnit || !revisedUnit) return false;
      const remapped = remapMentionSpanThroughEdit(
        { exact: previous.exact, occurrence: previous.occurrence },
        previousUnit[previous.language],
        revisedUnit[candidate.language],
        candidate.language,
      );
      return remapped?.exact === candidate.exact &&
        remapped.startCodePoint === candidate.startCodePoint &&
        remapped.endCodePoint === candidate.endCodePoint;
    });
    const remappedDispositionKinds = new Set(remappedPriorDispositions.map((item) =>
      `${item.disposition}\u0000${item.reason}\u0000${item.note ?? ''}`
    ));
    if (remappedPriorDispositions.length > 0 && remappedDispositionKinds.size === 1) {
      reconciled.candidateDispositions.push({
        ...structuredClone(remappedPriorDispositions[0]),
        candidate: candidate.id,
      });
      accounted.add(candidate.id);
      continue;
    }
    const priorSurfaceDispositions = previousDispositions.filter((disposition) => {
      const previous = previousCandidateById.get(disposition.candidate);
      return previous &&
        previous.language === candidate.language &&
        previous.exact === candidate.exact;
    });
    const priorDispositionKinds = new Set(priorSurfaceDispositions.map((item) =>
      `${item.disposition}\u0000${item.reason}\u0000${item.note ?? ''}`
    ));
    if (priorSurfaceDispositions.length > 0 && priorDispositionKinds.size === 1) {
      reconciled.candidateDispositions.push({
        ...structuredClone(priorSurfaceDispositions[0]),
        candidate: candidate.id,
      });
      accounted.add(candidate.id);
      continue;
    }
    const counterpartDispositions = reconciled.candidateDispositions.filter((disposition) => {
      const counterpart = candidateById.get(disposition.candidate);
      return counterpart &&
        counterpart.unit === candidate.unit &&
        counterpart.language !== candidate.language &&
        sharedGlossaryEntry(counterpart, candidate);
    });
    const dispositionKinds = new Set(counterpartDispositions.map((item) =>
      `${item.disposition}\u0000${item.reason}\u0000${item.note ?? ''}`
    ));
    if (counterpartDispositions.length > 0 && dispositionKinds.size === 1) {
      reconciled.candidateDispositions.push({
        ...structuredClone(counterpartDispositions[0]),
        candidate: candidate.id,
      });
      accounted.add(candidate.id);
      continue;
    }
    const containing = reconciled.mentions.filter((mention) => candidateInsideMention(candidate, mention));
    if (containing.length === 1) {
      containing[0].candidateRefs.push(candidate.id);
      accounted.add(candidate.id);
      continue;
    }
    const enclosed = reconciled.mentions.filter((mention) => candidateEnclosesMention(candidate, mention));
    if (enclosed.length === 1) {
      const mention = enclosed[0];
      const otherOverlap = reconciled.mentions.some((other) =>
        other !== mention && other.unit.id === candidate.unit && other.spans[candidate.language].some((span) =>
          candidate.startCodePoint < span.endCodePoint && span.startCodePoint < candidate.endCodePoint
        )
      );
      if (!otherOverlap) {
        const previous = mention.spans[candidate.language].find((span) =>
          candidate.startCodePoint <= span.startCodePoint && candidate.endCodePoint >= span.endCodePoint
        );
        const replacement = exactSpanAt(
          unitById.get(candidate.unit)[candidate.language],
          candidate.exact,
          candidate.occurrence,
        );
        mention.spans[candidate.language] = mention.spans[candidate.language]
          .filter((span) => span !== previous);
        mention.spans[candidate.language].push(replacement);
        mention.candidateRefs.push(candidate.id);
        accounted.add(candidate.id);
        continue;
      }
    }
    const partialOverlaps = reconciled.mentions.flatMap((mention) =>
      mention.unit.id === candidate.unit
        ? mention.spans[candidate.language]
          .filter((span) => spansOverlap(candidate, span))
          .map((span) => ({ mention, span }))
        : []
    );
    if (partialOverlaps.length === 1) {
      const { mention, span } = partialOverlaps[0];
      const replacement = coveringSpan(
        unitById.get(candidate.unit)[candidate.language],
        candidate,
        span,
      );
      mention.spans[candidate.language] = mention.spans[candidate.language]
        .filter((item) => item !== span);
      mention.spans[candidate.language].push(replacement);
      mention.candidateRefs.push(candidate.id);
      accounted.add(candidate.id);
      continue;
    }
    if (partialOverlaps.length > 1 && candidate.language === 'en') {
      const titleClaims = reconciled.claims.filter((claim) =>
        claim.predicate === 'name' &&
        claim.value?.kind === 'title' &&
        claimEvidenceUnit(claim, candidate.unit) &&
        typeof claim.value?.en === 'string' &&
        surfaceContains(candidate.exact, claim.value.en, 'en')
      );
      const titledPeople = new Set(titleClaims.flatMap((claim) => {
        const hasPersonalNameInCandidate = reconciled.claims.some((nameClaim) =>
          nameClaim.subject === claim.subject &&
          nameClaim.predicate === 'name' &&
          nameClaim.value?.kind !== 'title' &&
          claimEvidenceUnit(nameClaim, candidate.unit) &&
          typeof nameClaim.value?.en === 'string' &&
          surfaceContains(candidate.exact, nameClaim.value.en, 'en')
        );
        return hasPersonalNameInCandidate ? [claim.subject] : [];
      }));
      if (titledPeople.size === 1) {
        const person = [...titledPeople][0];
        const titleSurfaces = new Set(titleClaims
          .filter((claim) => claim.subject === person)
          .map((claim) => claim.value.en.toLocaleLowerCase('en-US')));
        for (const { mention, span } of partialOverlaps) {
          if (titleSurfaces.has(span.exact.toLocaleLowerCase('en-US'))) mention.person = person;
        }
      }
    }
    if (addLeadingParentheticalAlias(
      reconciled,
      candidate,
      unitById.get(candidate.unit),
    )) {
      accounted.add(candidate.id);
      continue;
    }
    if (addPosthumousNameCandidate(
      reconciled,
      candidate,
      unitById.get(candidate.unit),
    )) {
      accounted.add(candidate.id);
      continue;
    }
    let aliasMatches = reconciled.people.flatMap((person) =>
      aliasesForPerson(reconciled, person.localId, candidate.language, candidate.unit)
        .filter((alias) => {
          if (surfaceContains(candidate.exact, alias.exact, candidate.language)) return true;
          const fragmentMatch = surfaceContains(alias.exact, candidate.exact, candidate.language) ||
            (candidate.language === 'en' && sharedWordCount(candidate.exact, alias.exact) >= 2);
          if (!fragmentMatch) return false;
          return exactOccurrences(
            unitById.get(candidate.unit)[candidate.language],
            alias.exact,
            candidate.language,
          )
            .some((span) => spansOverlap(span, candidate));
        })
        .map((alias) => ({ person: person.localId, alias }))
    );
    const exactAliasMatches = aliasMatches.filter((item) => item.alias.exact === candidate.exact);
    if (exactAliasMatches.length > 0) aliasMatches = exactAliasMatches;
    if (
      aliasMatches.length === 0 &&
      candidate.language === 'en' &&
      !ENGLISH_CONTEXTUAL_PERSON_TITLES.has(candidate.exact) &&
      (candidate.exact.includes(' ') || [...candidate.exact].length >= 4)
    ) {
      aliasMatches = reconciled.claims.flatMap((claim) => {
        if (claim.predicate !== 'name' || claim.value?.[candidate.language] !== candidate.exact) {
          return [];
        }
        return [{
          person: claim.subject,
          alias: {
            exact: candidate.exact,
            kind: mentionKindForNameKind(claim.value?.kind),
            preferred: false,
          },
        }];
      });
    }
    if (
      aliasMatches.length === 0 &&
      !(
        candidate.language === 'en' &&
        ENGLISH_CONTEXTUAL_PERSON_TITLES.has(candidate.exact)
      )
    ) {
      aliasMatches = reconciled.people.flatMap((person) => {
        const exact = person.preferredNameSuggestion?.[candidate.language];
        if (exact !== candidate.exact) return [];
        const nameClaim = reconciled.claims.find((claim) =>
          claim.subject === person.localId &&
          claim.predicate === 'name' &&
          claim.value?.[candidate.language] === exact
        );
        return [{
          person: person.localId,
          alias: {
            exact,
            kind: mentionKindForNameKind(nameClaim?.value?.kind),
            preferred: true,
          },
        }];
      });
    }
    const matchingPeople = new Set(aliasMatches.map((item) => item.person));
    if (matchingPeople.size === 1) {
      const person = [...matchingPeople][0];
      const unit = unitById.get(candidate.unit);
      const match = aliasMatches.find((item) => item.person === person);
      const aliasOccurrences = exactOccurrences(
        unit[candidate.language],
        match.alias.exact,
        candidate.language,
      );
      const aliasSpan = candidate.exact.includes(match.alias.exact)
        ? exactSpanAt(unit[candidate.language], candidate.exact, candidate.occurrence)
        : aliasOccurrences.find((span) => spansOverlap(span, candidate)) ?? aliasOccurrences[0];
      const overlapping = reconciled.mentions.filter((mention) =>
        mention.person === person &&
        mention.unit.id === candidate.unit &&
        mention.spans[candidate.language].some((span) => spansOverlap(span, aliasSpan))
      );
      const conflicts = reconciled.mentions.some((mention) =>
        mention.person !== person &&
        mention.unit.id === candidate.unit &&
        mention.spans[candidate.language].some((span) => spansOverlap(span, aliasSpan))
      );
      if (overlapping.length === 1 && !conflicts) {
        const mention = overlapping[0];
        mention.spans[candidate.language] = mention.spans[candidate.language]
          .filter((span) => !spansOverlap(span, aliasSpan));
        mention.spans[candidate.language].push(aliasSpan);
        mention.kind = match.alias.kind;
        mention.candidateRefs.push(candidate.id);
        accounted.add(candidate.id);
        continue;
      }
      if (addAliasMention(
        reconciled,
        unit,
        person,
        candidate.language,
        match.alias.kind,
        aliasSpan,
      )) {
        const mention = reconciled.mentions.at(-1);
        mention.candidateRefs.push(candidate.id);
        accounted.add(candidate.id);
        continue;
      }
    }
    if (candidate.language === 'en') {
      const unitIndex = revisedPacket.units.findIndex((unit) => unit.id === candidate.unit);
      const previousUnitId = revisedPacket.units[unitIndex - 1]?.id;
      const precedingMatches = reconciled.mentions.filter((mention) =>
        mention.unit.id === previousUnitId &&
        mention.spans.en.some((span) => span.exact === candidate.exact)
      );
      const precedingPeople = new Set(precedingMatches.map((mention) => mention.person));
      if (precedingPeople.size === 1) {
        const prior = precedingMatches[0];
        const span = exactSpanAt(
          unitById.get(candidate.unit).en,
          candidate.exact,
          candidate.occurrence,
        );
        if (addAliasMention(
          reconciled,
          unitById.get(candidate.unit),
          prior.person,
          'en',
          prior.kind,
          span,
        )) {
          reconciled.mentions.at(-1).candidateRefs.push(candidate.id);
          accounted.add(candidate.id);
          continue;
        }
      }
    }
    const overlapPeople = new Set(partialOverlaps.map(({ mention }) => mention.person));
    if (partialOverlaps.length > 1 && overlapPeople.size > 1) {
      const titlePeople = new Set(partialOverlaps
        .filter(({ mention }) => mention.kind === 'title-reference')
        .map(({ mention }) => mention.person));
      const nameOverlaps = partialOverlaps.filter(({ mention }) => mention.kind !== 'title-reference');
      if (titlePeople.size === 1 && nameOverlaps.length === 1) {
        const titlePerson = [...titlePeople][0];
        const displacedPerson = nameOverlaps[0].mention.person;
        const repeated = reconciled.mentions.find((mention) =>
          mention !== nameOverlaps[0].mention &&
          mention.person === titlePerson &&
          mention.unit.id === candidate.unit &&
          mention.spans[candidate.language].some((span) =>
            span.exact === nameOverlaps[0].span.exact && !spansOverlap(span, candidate)
          )
        );
        if (displacedPerson !== titlePerson && repeated) {
          nameOverlaps[0].mention.person = titlePerson;
          repeated.person = displacedPerson;
          overlapPeople.clear();
          overlapPeople.add(titlePerson);
        }
      }
    }
    if (partialOverlaps.length > 1 && overlapPeople.size === 1) {
      const target = partialOverlaps[0].mention;
      const unit = unitById.get(candidate.unit);
      const candidateSpan = exactSpanAt(
        unit[candidate.language],
        candidate.exact,
        candidate.occurrence,
      );
      const mergedSpan = partialOverlaps.reduce(
        (span, current) => coveringSpan(unit[candidate.language], span, current.span),
        candidateSpan,
      );
      for (const { mention, span } of partialOverlaps) {
        mention.spans[candidate.language] = mention.spans[candidate.language]
          .filter((item) => item !== span);
        target.candidateRefs.push(...mention.candidateRefs);
      }
      target.spans[candidate.language].push(mergedSpan);
      target.candidateRefs.push(candidate.id);
      accounted.add(candidate.id);
      continue;
    }
    if (candidate.language === 'en') {
      const unit = unitById.get(candidate.unit);
      const points = [...unit.en];
      const preceding = reconciled.mentions.flatMap((mention) =>
        mention.unit.id === candidate.unit
          ? mention.spans.en
            .filter((span) => /^\s*\($/u.test(
              points.slice(span.endCodePoint, candidate.startCodePoint).join(''),
            ))
            .map((span) => ({ mention, span }))
          : []
      );
      const nearestEnd = Math.max(-1, ...preceding.map(({ span }) => span.endCodePoint));
      const nearest = preceding.filter(({ span }) => span.endCodePoint === nearestEnd);
      const precedingPeople = new Set(nearest.map(({ mention }) => mention.person));
      const closesParenthesis = /^\)/u.test(points.slice(candidate.endCodePoint).join(''));
      if (closesParenthesis && precedingPeople.size === 1) {
        const person = [...precedingPeople][0];
        const span = exactSpanAt(unit.en, candidate.exact, candidate.occurrence);
        if (addAliasMention(reconciled, unit, person, 'en', 'alternate-name', span)) {
          reconciled.mentions.at(-1).candidateRefs.push(candidate.id);
          if (!reconciled.claims.some((claim) =>
            claim.subject === person &&
            claim.predicate === 'name' &&
            claim.value?.en === candidate.exact
          )) {
            reconciled.claims.push({
              id: `${reconciled.book}:${reconciled.chapter}:c-parenthetical-alias`,
              subject: person,
              predicate: 'name',
              value: { kind: 'alternate-name', en: candidate.exact },
              certainty: 'strongly-inferred',
              evidence: [`${reconciled.book}:${reconciled.chapter}:${candidate.unit}`],
            });
          }
          accounted.add(candidate.id);
          continue;
        }
      }
    }
    if (candidate.language === 'en' && knownPolities.has(candidate.exact)) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'polity',
        note: `Known polity from chapter identity hints: ${candidate.exact}`,
      });
      accounted.add(candidate.id);
      continue;
    }
    if (candidate.language === 'en' && knownReignPeriods.has(candidate.exact)) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'reign-period',
        note: `Reign-period name established elsewhere in the chapter: ${candidate.exact}`,
      });
      accounted.add(candidate.id);
      continue;
    }
    if (candidate.language === 'en') {
      const unitText = unitById.get(candidate.unit).en;
      const codePoints = [...unitText];
      const before = codePoints.slice(0, candidate.startCodePoint).join('');
      const after = codePoints.slice(candidate.endCodePoint).join('');
      if (/^(?:and|but|or) (?:asked|replied|said)$/u.test(candidate.exact)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'not-a-name',
          note: 'Speech-introducing function phrase, not a person name.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (
        ['Dalü', 'Zhonglü', 'Nanlü', 'Zhong Lü', 'Nan Lü'].includes(candidate.exact) &&
        /\b(?:inches|music|modes?|note|pairing|palace(?:-of)?|pitch(?:es)?|pitch-?pipe|refers to|sang)\b/iu.test(unitText)
      ) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'not-a-name',
          note: 'Named musical pitch standard in a technical definition or measurement.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (/^:\s+(?:a\s+)?place name\b/iu.test(after)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'place',
          note: 'Headword explicitly glossed as a place name.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (/\ba title for (?:tribal )?chiefs\b/iu.test(unitText)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'office',
          note: 'Headword or variant explicitly glossed as a title for chiefs.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (
        (candidate.exact === 'Song' && /^\s+of\s+[A-Z]/u.test(after)) ||
        (/\(Song of\s+$/u.test(before) && /^\)/u.test(after)) ||
        (candidate.exact === 'Wind' && /['’]South[ \t]*$/u.test(before))
      ) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'book-title',
          note: 'Component of an explicitly labeled song title, not a person.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (
        /^(?:[ \t]+(?:era|reign|year)\b|[ \t]*\(\d{3,4}\))/iu.test(after) ||
        /\b(?:beginning|opening|year) of[ \t]+$/iu.test(before) ||
        (/\b(?:in|of)[ \t]+$/iu.test(before) && /^[ \t]+\d+\b/u.test(after))
      ) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'reign-period',
          note: 'Capitalized reign-period name identified from its date context.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (/^(?:[ \t]+and[ \t]+[\p{Lu}][\p{L}'’–-]*)*[ \t]+(?:people|peoples|tribe|tribes|clan|clans|clansmen|faction|kings|kingships)\b/iu.test(after)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'collective',
          note: 'Ethnic or social collective named immediately before its group noun.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (candidate.exact === "Rus'" && /\bagainst the[ \t]*$/iu.test(before)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'collective',
          note: 'The Rus people named as the object of a campaign, not an individual.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (candidate.exact === "Rus'" && /\b(?:garrison|hold)[ \t]*$/iu.test(before)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'place',
          note: 'Rus named as the territory being garrisoned, not an individual.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (candidate.exact === 'Zhou' && /\b(?:entering|within)[ \t]*$/iu.test(before)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'polity',
          note: 'Northern Zhou named as a polity or political territory, not an individual.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (candidate.exact === 'Lü' && /\bamong the[ \t]*$/iu.test(before)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'collective',
          note: 'The Lü clan named collectively, not Empress Lü or another individual.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (candidate.exact === 'Lü' && /\bextirpated the[ \t]*$/iu.test(before)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'collective',
          note: 'The Lü clansmen named collectively as the object of extirpation.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (
        candidate.exact === 'Lü' &&
        (/\b(?:clans|maternal kin|mother's people)\b/iu.test(unitText) ||
          /\b(?:Shen and Lü|Lü and Huo)\b/u.test(unitText))
      ) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'collective',
          note: 'The Lü clan or maternal kin are named collectively, not an individual Lü.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (candidate.exact === 'Yi' && /\bMan and[ \t]*$/u.test(before)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'collective',
          note: 'The Yi people paired with the Man peoples, not the person Yi Yin.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (
        candidate.exact === 'Yelü' &&
        (/^[ \t]+bu\b/iu.test(after) ||
          /\bdivided three[ \t]*$/iu.test(before) ||
          /\b(?:clan|names?|surname)\b/iu.test(unitText))
      ) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'collective',
          note: 'The Yelü clan, its divisions, or its surname is named collectively, not an individual clan member.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (
        candidate.exact === 'Shulü' &&
        ((/\bthe[ \t]*$/iu.test(before) && /^[ \t]+were\b/iu.test(after)) ||
          /^[ \t]+lineages\b/iu.test(after))
      ) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'collective',
          note: 'The Shulü lineage is named collectively, not an individual clan member.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (candidate.exact === 'Three Yelü' && /^\s*:/u.test(after)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'collective',
          note: 'Heading for the three Yelü clan divisions, not an individual person.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (candidate.exact === 'Yan' && /\bin[ \t]*$/iu.test(before)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'polity',
          note: 'The state of Yan in a locative construction, not a person.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (
        candidate.exact === 'Shu' &&
        /\bOnly[ \t]*$/u.test(before) &&
        /^[ \t]+produces\b/iu.test(after)
      ) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'polity',
          note: 'The region of Shu identified as the producer of a commodity, not a person.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (
        candidate.exact === 'Tang' &&
        /^[ \t]+(?:regulations|rules)\b/iu.test(after)
      ) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'polity',
          note: 'The Tang dynasty modifying its regulations or rules, not a person.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (/^(?:\s+and\s+[\p{Lu}][\p{L}'’-]*)?\s+ruling houses?\b/u.test(after)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'polity',
          note: 'Ruling-clan house, not an individual person.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (/^[ \t]+(?:army|command|division|garrison)\b/iu.test(after)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'organization',
          note: 'Named military organization, not a person.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (
        /\bprefectures?\b[^.;!?]*$/iu.test(before) ||
        /^[ \t]+(?:County|Prefecture|Province)\b/u.test(after) ||
        /^(?:,\s*[\p{Lu}][\p{L}'’-]*)*(?:,\s*)?(?:and\s+)?other prefectures?\b/iu.test(after)
      ) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'place',
          note: 'Administrative place name, not a person.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (/^(?:,\s*(?:and\s+)?[A-Z][\p{L}'’-]*)*\s+rivers?\b/u.test(after)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'place',
          note: 'Named river in a bounded geographic list, not a person.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (/\bsurplus salt from(?:[ \t]+[\p{Lu}][\p{L}'’-]*,?)*[ \t]*$/u.test(before)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'place',
          note: 'Territorial source in a list of surplus-salt origins, not a person.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (/\bprinces of\s+$/iu.test(before)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'polity',
          note: 'Dynastic or territorial label governing a group of princes.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (/\b(?:Pacifies|Pacifying) the\s+$/u.test(before)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'office',
          note: 'Directional component of a military office title, not a person.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (
        /^[A-Z][a-z]+zhou$/u.test(candidate.exact)
      ) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'place',
          note: 'Romanized zhou place name identified from its locative context.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (
        /^(?:Eastern|Northern|Southern|Western)$/u.test(candidate.exact) &&
        /^(?:\s+and\s+(?:Eastern|Northern|Southern|Western))?\s+(?:Army|Bureau|Command|Court|Division|Office|Palace|Region)\b/iu.test(after)
      ) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'organization',
          note: 'Directional component of an institutional or military name, not a person.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (
        candidate.exact === 'Zhao' &&
        /^[ \t]+(?:airs|harps|music|songs|zithers)\b/iu.test(after)
      ) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'other',
          note: 'Regional descriptor for a musical tradition or instrument, not a person.',
        });
        accounted.add(candidate.id);
        continue;
      }
    }
    if (
      candidate.language === 'en' &&
      /^[ \t]+commandery(?:['’]s)?\b/iu.test(
        [...unitById.get(candidate.unit).en].slice(candidate.endCodePoint).join('')
      )
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'place',
        note: 'Component of a commandery name, not a person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      /^[ \t]+Hall\b/u.test(
        [...unitById.get(candidate.unit).en].slice(candidate.endCodePoint).join('')
      )
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'place',
        note: 'Component of a hall name, not a person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      /^(?:Cloth|Coin|Knife)(?: Worth)? (?:One|Twenty|Thirty|Forty|Fifty|Five Hundred|Five Thousand|One Hundred)$/u.test(candidate.exact)
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'other',
        note: 'Currency or commodity denomination label, not a person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (candidate.language === 'en' && candidate.exact === 'Ghosts’') {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'other',
        note: 'Possessive form of the Ghosts asterism (輿鬼), not a person or deity.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      /^Biographies\b/u.test(candidate.exact) &&
      /\bVolume\b[^.;!?]*,\s*$/u.test(
        [...unitById.get(candidate.unit).en].slice(0, candidate.startCodePoint).join('')
      )
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'book-title',
        note: 'Volume section heading, not a person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (candidate.language === 'en' && ENGLISH_NAMED_PLACE_TERMS.has(candidate.exact)) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'place',
        note: 'Named place, not a person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (candidate.language === 'en' && ENGLISH_NAMED_ORGANIZATION_TERMS.has(candidate.exact)) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'organization',
        note: 'Named institution, not a person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (candidate.language === 'en' && ENGLISH_COLLECTIVE_PERSON_TERMS.has(candidate.exact)) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'collective',
        note: 'Plural class of title holders, not an individual person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (candidate.language === 'en' && ENGLISH_INSTITUTIONAL_SUFFIX_RE.test(candidate.exact)) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'organization',
        note: 'Capitalized institutional name, not a person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (candidate.language === 'en' && ENGLISH_NAMED_POLITY_TERMS.has(candidate.exact)) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'polity',
        note: 'Named polity, not a person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (candidate.language === 'en' && ENGLISH_BOOK_TITLE_TERMS.has(candidate.exact)) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'book-title',
        note: 'Named work or chapter title, not a person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (candidate.language === 'en' && ENGLISH_NAMED_NON_PERSON_TERMS.has(candidate.exact)) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'other',
        note: 'Named institution, place, or procedure, not a person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (candidate.language === 'en' && ENGLISH_NAMED_OFFICE_TERMS.has(candidate.exact)) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'office',
        note: 'Office-title component, not a person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      [...ENGLISH_NAMED_OFFICE_TERMS].some((term) => surfaceContains(candidate.exact, term, 'en')) &&
      [...ENGLISH_NOBLE_TITLE_TERMS].some((term) => surfaceContains(candidate.exact, term, 'en'))
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'office',
        note: 'Scanner span crosses an office-title and noble-title boundary.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (candidate.language === 'en' && ENGLISH_NOBLE_TITLE_TERMS.has(candidate.exact)) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'title',
        note: 'Noble-rank component, not a person name by itself.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      candidate.exact === 'Jianwu' &&
      /\bJianwu era\b/u.test(unitById.get(candidate.unit).en)
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'other',
        note: 'Jianwu is a reign era, not a person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      candidate.exact === 'Nan' &&
      /\bNan Commandery\b/u.test(unitById.get(candidate.unit).en)
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'place',
        note: 'Nan is part of the place name Nan Commandery.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      candidateMatchesPlaceClaim(reconciled, candidate)
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'place',
        note: 'Place name recorded in this unit, not a person name.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      ['occupation', 'office'].some((predicate) =>
        candidateMatchesClaimValue(reconciled, candidate, predicate)
      )
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'office',
        note: 'Component of an office recorded in this unit, not a person name.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      candidateMatchesClaimValue(reconciled, candidate, 'credential')
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'other',
        note: 'Credential or recommendation category recorded in this unit, not a person name.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      ['authorship', 'work-association'].some((predicate) =>
        candidateMatchesClaimValue(reconciled, candidate, predicate)
      )
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'book-title',
        note: 'Component of a cited or authored work recorded in this unit.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      candidateMatchesClaimValue(reconciled, candidate, 'organization-association')
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'organization',
        note: 'Component of an organization recorded in this unit, not a person name.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      candidateMatchesNamedTitleClaim(reconciled, candidate)
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'title',
        note: 'Component of an honorific or noble title recorded in this unit.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      (candidate.exact === 'Feng' || candidate.exact === 'Shan') &&
      /\bFeng and Shan (?:rites|sacrifices)\b/u.test(unitById.get(candidate.unit).en)
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'other',
        note: 'Part of the Feng and Shan sacrifice name, not a person.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      /^[ \t]+hour\b/iu.test(
        [...unitById.get(candidate.unit).en].slice(candidate.endCodePoint).join('')
      )
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'other',
        note: 'Traditional hour label, not a person name.',
      });
      accounted.add(candidate.id);
      continue;
    }
    if (
      candidate.language === 'en' &&
      (ENGLISH_SENTENCE_INITIAL_NON_NAMES.has(candidate.exact) ||
        ENGLISH_FUNCTION_PHRASE_RE.test(candidate.exact)) &&
      candidate.detectors.every((detector) => detector.kind === 'english-capitalized-expression')
    ) {
      reconciled.candidateDispositions.push({
        candidate: candidate.id,
        disposition: 'not-person',
        reason: 'not-a-name',
        note: 'Sentence-initial English word.',
      });
      accounted.add(candidate.id);
      continue;
    }
    unresolvedCandidates.push(candidate.id);
  }

  // A later candidate can reconstruct a mention that also covers an earlier
  // unresolved fragment. Recheck after all mention growth so candidate order
  // does not create a false failure.
  for (const candidateId of unresolvedCandidates) {
    const candidate = revisedPacket.preflight.candidates.find((item) => item.id === candidateId);
    const containing = reconciled.mentions.filter((mention) => candidateInsideMention(candidate, mention));
    if (containing.length === 1) containing[0].candidateRefs.push(candidate.id);
  }

  // Candidate reconciliation can widen an existing alias or add a second
  // mention for the same person. Collapse those spans only after all mention
  // growth has finished, and preserve the candidate accounting on the cover.
  removeRedundantSamePersonSpans(reconciled.mentions, candidateById);
  reconciled.mentions = reconciled.mentions.filter((mention) =>
    mention.spans.zh.length > 0 || mention.spans.en.length > 0
  );
  for (const mention of reconciled.mentions) {
    const unit = unitById.get(mention.unit.id);
    if (unit) coalesceOverlappingMentionSpans(mention, unit);
  }

  // Span growth and deduplication can move candidate coverage between
  // mentions. Re-account from the final geometry so no valid candidate ref is
  // lost merely because its containing mention was widened later in the pass.
  const finalAccounted = new Set(reconciled.candidateDispositions.map((item) => item.candidate));
  for (const mention of reconciled.mentions) {
    for (const candidateId of mention.candidateRefs) finalAccounted.add(candidateId);
  }
  const unresolvedAfterFinalMerge = revisedPacket.preflight.candidates.filter((candidate) => {
    if (finalAccounted.has(candidate.id)) return false;
    const containing = reconciled.mentions.filter((mention) => candidateInsideMention(candidate, mention));
    if (containing.length !== 1) return true;
    containing[0].candidateRefs.push(candidate.id);
    finalAccounted.add(candidate.id);
    return false;
  }).map((candidate) => candidate.id);

  // A span can widen late in reconciliation and come to cover a scanner
  // fragment that was provisionally classified as a non-person. The final
  // person mention is the stronger accounting result.
  removeDispositionMentionConflicts(reconciled);

  for (const mention of reconciled.mentions) {
    mention.candidateRefs = [...new Set(mention.candidateRefs)];
    mention.candidateRefs.sort((left, right) =>
      (candidateOrder.get(left) ?? Number.MAX_SAFE_INTEGER) -
      (candidateOrder.get(right) ?? Number.MAX_SAFE_INTEGER)
    );
  }

  const claimSubjects = new Set(reconciled.claims.map((claim) => claim.subject));
  const mentionedPeople = new Set(reconciled.mentions.map((mention) => mention.person));
  const unsupportedPeople = new Set(reconciled.people.flatMap((person) =>
    !claimSubjects.has(person.localId) && !mentionedPeople.has(person.localId)
      ? [person.localId]
      : []
  ));
  reconciled.people = reconciled.people.filter((person) => !unsupportedPeople.has(person.localId));
  reconciled.mentions = reconciled.mentions.filter((mention) =>
    !unsupportedPeople.has(mention.person)
  );
  reconciled.claims = reconciled.claims.filter((claim) =>
    !nestedStringValues(claim.value).some((value) => unsupportedPeople.has(value))
  );

  // A reviewed repair can introduce a person's preferred romanization only
  // once, below the scanner's repeated-single-token threshold. When that
  // person is already evidenced in the same unit, restore the exact display
  // link after stale conflicting spans and unsupported people are gone.
  for (const person of reconciled.people) {
    const exact = person.preferredNameSuggestion?.en;
    if (typeof exact !== 'string' || !exact.trim()) continue;
    const contextUnits = new Set([
      ...reconciled.mentions
        .filter((mention) => mention.person === person.localId)
        .map((mention) => mention.unit.id),
      ...reconciled.claims
        .filter((claim) => claim.subject === person.localId)
        .flatMap((claim) => claim.evidence.map((evidence) => evidence.split(':').at(-1))),
    ]);
    for (const unitId of contextUnits) {
      const unit = unitById.get(unitId);
      if (!unit) continue;
      for (const span of exactOccurrences(unit.en, exact, 'en')) {
        const alreadyLinked = reconciled.mentions.some((mention) =>
          mention.person === person.localId &&
          mention.unit.id === unitId &&
          mention.spans.en.some((current) =>
            current.startCodePoint <= span.startCodePoint && current.endCodePoint >= span.endCodePoint
          )
        );
        if (alreadyLinked) continue;
        addAliasMention(reconciled, unit, person.localId, 'en', 'personal-name', span);
      }
    }
  }

  renumberPeopleAndClaims(reconciled);
  renumberMentions(reconciled);

  return { extraction: reconciled, unresolvedCandidates: unresolvedAfterFinalMerge, unresolvedSpans };
}
