import {
  exactSpanAt,
  setTranslationField,
} from './people-content.mjs';

const ENGLISH_SENTENCE_INITIAL_NON_NAMES = new Set([
  'All',
  'Customs',
  'Even',
  'How',
  'Illness',
  'Is',
  'Once',
  'Only',
  'Though',
  'Under',
]);
const ENGLISH_FUNCTION_PHRASE_RE = /^(?:Am I|Even I|Though (?:He|I|It|She|That|These|They|This|Those|We))\b/u;
const ENGLISH_NAMED_NON_PERSON_TERMS = new Set([
  'Circular Moat',
  'Earth Goddess',
  'Five Altars',
  'Heaven',
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
  'Hengcheng Gate',
  'Hong Terrace',
  'Salt Marsh',
  'Yong',
]);
const ENGLISH_NAMED_POLITY_TERMS = new Set([
  'Eastern Yue',
]);
const ENGLISH_NAMED_OFFICE_TERMS = new Set([
  'Broad Benefit Office',
  'Charging Cavalry',
  'Gou Shield',
  'Grandee',
  'Imperial Workshops',
  'Nobility Ranks',
  'Privy Treasurer',
  'Splendid Light',
  'Three Commanders',
]);

function locatorKey(locator) {
  return `${locator.id}:${locator.blockIndex}:${locator.collection}:${locator.itemIndex}`;
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
    if (claim.subject !== personId || claim.predicate !== 'name' || !claimEvidenceUnit(claim, unitId)) continue;
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
  if (/^[A-Z]/u.test(oldExact) && !/[A-Z]/u.test(replacement)) return false;
  return true;
}

// A reviewed repair may change a person's printed name while also changing other
// words in the same sentence. Relocate the old span between the nearest unchanged
// tokens so exact person links survive both edits without guessing an identity.
export function remapMentionSpanThroughEdit(span, oldText, newText, language) {
  const oldLocation = resolvedOldSpan(oldText, span);
  if (!oldLocation || oldText === newText) return null;

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
    ['honor', 'noble-title'].includes(claim.predicate) &&
    claimEvidenceUnit(claim, candidate.unit) &&
    nestedStringValues(claim.value).some((value) =>
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

  reconciled.input = structuredClone(revisedPacket.input);
  if (options.markRepairsApplied !== false) {
    reconciled.translationRepairs = reconciled.translationRepairs.map((repair) => ({
      ...repair,
      status: 'applied',
    }));
  }
  reconciled.mentions = reconciled.mentions.map((mention) => {
    const unit = unitById.get(mention.unit.id);
    if (!unit) return mention;
    return normalizeMentionSpans(mention, unit, staleSpans);
  });
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
    let mapped = false;
    for (const { alias, span } of selected) {
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
      const previousUnit = previousUnitById.get(stale.mention.unit.id);
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
    if (!mapped) {
      const hasRemainingUnitContext = reconciled.mentions.some((mention) =>
        mention.person === stale.mention.person &&
        mention.unit.id === stale.mention.unit.id &&
        (mention.spans.zh.length > 0 || mention.spans.en.length > 0)
      ) || reconciled.claims.some((claim) =>
        claim.subject === stale.mention.person &&
        claimEvidenceUnit(claim, stale.mention.unit.id)
      );
      if (!hasRemainingUnitContext) continue;
      const hasRemainingMention = reconciled.mentions.some((mention) =>
        mention.person === stale.mention.person &&
        (mention.spans.zh.length > 0 || mention.spans.en.length > 0)
      );
      const hasRemainingClaim = reconciled.claims.some((claim) =>
        claim.subject === stale.mention.person
      );
      if (!hasRemainingMention && !hasRemainingClaim) {
        orphanedStalePeople.add(stale.mention.person);
      } else {
        unresolvedSpans.push(stale);
      }
    }
  }
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
    if (aliasMatches.length === 0) {
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
    if (candidate.language === 'en') {
      const unitText = unitById.get(candidate.unit).en;
      const codePoints = [...unitText];
      const before = codePoints.slice(0, candidate.startCodePoint).join('');
      const after = codePoints.slice(candidate.endCodePoint).join('');
      if (/^[ \t]+(?:people|peoples|tribe|tribes|clan|clans)\b/iu.test(after)) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'collective',
          note: 'Ethnic or social collective named immediately before its group noun.',
        });
        accounted.add(candidate.id);
        continue;
      }
      if (
        /\bprefectures?\b[^.;!?]*$/iu.test(before) ||
        /^[ \t]+Prefecture\b/u.test(after)
      ) {
        reconciled.candidateDispositions.push({
          candidate: candidate.id,
          disposition: 'not-person',
          reason: 'place',
          note: 'Prefecture name, not a person.',
        });
        accounted.add(candidate.id);
        continue;
      }
    }
    if (
      candidate.language === 'en' &&
      /^[ \t]+Commandery\b/u.test(
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
      candidateMatchesClaimValue(reconciled, candidate, 'office')
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
  const unresolvedAfterMentionGrowth = unresolvedCandidates.filter((candidateId) => {
    const candidate = revisedPacket.preflight.candidates.find((item) => item.id === candidateId);
    const containing = reconciled.mentions.filter((mention) => candidateInsideMention(candidate, mention));
    if (containing.length !== 1) return true;
    containing[0].candidateRefs.push(candidate.id);
    return false;
  });

  // Candidate reconciliation can widen an existing alias or add a second
  // mention for the same person. Collapse those spans only after all mention
  // growth has finished, and preserve the candidate accounting on the cover.
  removeRedundantSamePersonSpans(reconciled.mentions, candidateById);
  reconciled.mentions = reconciled.mentions.filter((mention) =>
    mention.spans.zh.length > 0 || mention.spans.en.length > 0
  );

  for (const mention of reconciled.mentions) {
    for (const language of ['zh', 'en']) {
      const widestFirst = [...mention.spans[language]].sort((left, right) =>
        left.startCodePoint - right.startCodePoint || right.endCodePoint - left.endCodePoint
      );
      mention.spans[language] = widestFirst.filter((span, index) =>
        !widestFirst.slice(0, index).some((earlier) =>
          earlier.startCodePoint <= span.startCodePoint && span.endCodePoint <= earlier.endCodePoint
        )
      );
      mention.spans[language].sort((left, right) => left.startCodePoint - right.startCodePoint);
    }
    mention.candidateRefs = [...new Set(mention.candidateRefs)];
    mention.candidateRefs.sort((left, right) =>
      (candidateOrder.get(left) ?? Number.MAX_SAFE_INTEGER) -
      (candidateOrder.get(right) ?? Number.MAX_SAFE_INTEGER)
    );
  }

  renumberPeopleAndClaims(reconciled);
  renumberMentions(reconciled);

  return { extraction: reconciled, unresolvedCandidates: unresolvedAfterMentionGrowth, unresolvedSpans };
}
