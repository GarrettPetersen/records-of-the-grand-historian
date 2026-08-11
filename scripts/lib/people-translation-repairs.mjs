import {
  exactSpanAt,
  setTranslationField,
} from './people-content.mjs';

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
  };
  const person = extraction.people.find((item) => item.localId === personId);
  add(person?.preferredNameSuggestion?.[language], 'personal-name', true);
  for (const claim of extraction.claims) {
    if (claim.subject !== personId || claim.predicate !== 'name' || !claimEvidenceUnit(claim, unitId)) continue;
    add(claim.value?.[language], mentionKindForNameKind(claim.value?.kind));
  }
  return [...aliases.values()];
}

function exactOccurrences(text, exact) {
  const found = [];
  for (let occurrence = 0; ; occurrence += 1) {
    try {
      found.push(exactSpanAt(text, exact, occurrence));
    } catch {
      break;
    }
  }
  return found;
}

function wordSet(value) {
  return new Set(value.toLocaleLowerCase('en-US').match(/[\p{L}\p{N}]+/gu) ?? []);
}

function sharedWordCount(left, right) {
  const rightWords = wordSet(right);
  return [...wordSet(left)].filter((word) => rightWords.has(word)).length;
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
      try {
        return [exactSpanAt(unit[language], span.exact, span.occurrence)];
      } catch {
        staleSpans.push({ mention, language, span });
        return [];
      }
    });
  }
  return normalized;
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

  for (const mention of reconciled.mentions) {
    mention.candidateRefs = [];
  }
  reconciled.candidateDispositions = reconciled.candidateDispositions.filter((item) =>
    validCandidateIds.has(item.candidate)
  );

  const unresolvedSpans = [];
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
    ).flatMap((alias) => exactOccurrences(unit[stale.language], alias.exact).map((span) => ({ alias, span })));
    const related = aliases.filter((item) =>
      item.alias.preferred || sharedWordCount(stale.span.exact, item.alias.exact) > 0
    );
    const selected = related.length > 0 ? related : aliases;
    let mapped = false;
    for (const { alias, span } of selected) {
      const expanded = candidateExpandedSpan(
        span,
        unit.id,
        stale.language,
        revisedPacket.preflight.candidates,
      );
      mapped = addAliasMention(
        reconciled,
        unit,
        stale.mention.person,
        stale.language,
        alias.kind,
        expanded,
      ) || mapped;
    }
    if (!mapped) unresolvedSpans.push(stale);
  }
  reconciled.mentions = reconciled.mentions.filter((mention) =>
    mention.spans.zh.length > 0 || mention.spans.en.length > 0
  );

  const accounted = new Set(reconciled.candidateDispositions.map((item) => item.candidate));

  const unresolvedCandidates = [];
  for (const candidate of revisedPacket.preflight.candidates) {
    if (accounted.has(candidate.id)) continue;
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
    const aliasMatches = reconciled.people.flatMap((person) =>
      aliasesForPerson(reconciled, person.localId, candidate.language, candidate.unit)
        .filter((alias) =>
          candidate.exact.includes(alias.exact) ||
          (alias.exact.includes(candidate.exact) && exactOccurrences(
            unitById.get(candidate.unit)[candidate.language],
            alias.exact,
          ).length > 0)
        )
        .map((alias) => ({ person: person.localId, alias }))
    );
    const matchingPeople = new Set(aliasMatches.map((item) => item.person));
    if (matchingPeople.size === 1) {
      const person = [...matchingPeople][0];
      const unit = unitById.get(candidate.unit);
      const match = aliasMatches.find((item) => item.person === person);
      const aliasSpan = candidate.exact.includes(match.alias.exact)
        ? exactSpanAt(unit[candidate.language], candidate.exact, candidate.occurrence)
        : exactOccurrences(unit[candidate.language], match.alias.exact)[0];
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

  for (const mention of reconciled.mentions) {
    for (const language of ['zh', 'en']) {
      mention.spans[language].sort((left, right) => left.startCodePoint - right.startCodePoint);
    }
    mention.candidateRefs.sort((left, right) =>
      (candidateOrder.get(left) ?? Number.MAX_SAFE_INTEGER) -
      (candidateOrder.get(right) ?? Number.MAX_SAFE_INTEGER)
    );
  }

  renumberMentions(reconciled);

  return { extraction: reconciled, unresolvedCandidates: unresolvedAfterMentionGrowth, unresolvedSpans };
}
