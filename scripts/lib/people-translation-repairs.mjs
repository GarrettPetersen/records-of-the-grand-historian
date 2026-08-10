import {
  exactSpanAt,
  setTranslationField,
} from './people-content.mjs';

function locatorKey(locator) {
  return `${locator.id}:${locator.blockIndex}:${locator.collection}:${locator.itemIndex}`;
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

function normalizeMentionSpans(mention, unit) {
  const normalized = structuredClone(mention);
  for (const language of ['zh', 'en']) {
    normalized.spans[language] = normalized.spans[language].map((span) =>
      exactSpanAt(unit[language], span.exact, span.occurrence)
    );
  }
  return normalized;
}

function candidateInsideMention(candidate, mention) {
  return mention.unit.id === candidate.unit && mention.spans[candidate.language].some((span) =>
    span.startCodePoint <= candidate.startCodePoint && span.endCodePoint >= candidate.endCodePoint
  );
}

export function reconcileExtractionAfterRepairs(extraction, revisedPacket) {
  const reconciled = structuredClone(extraction);
  const candidateOrder = new Map(
    revisedPacket.preflight.candidates.map((candidate, index) => [candidate.id, index]),
  );
  const validCandidateIds = new Set(candidateOrder.keys());
  const unitById = new Map(revisedPacket.units.map((unit) => [unit.id, unit]));

  reconciled.input = structuredClone(revisedPacket.input);
  reconciled.translationRepairs = reconciled.translationRepairs.map((repair) => ({
    ...repair,
    status: 'applied',
  }));
  reconciled.mentions = reconciled.mentions.map((mention) => {
    const unit = unitById.get(mention.unit.id);
    if (!unit) return mention;
    try {
      return normalizeMentionSpans(mention, unit);
    } catch {
      return mention;
    }
  });

  for (const mention of reconciled.mentions) {
    mention.candidateRefs = [...new Set(mention.candidateRefs.filter((id) => validCandidateIds.has(id)))];
  }
  reconciled.candidateDispositions = reconciled.candidateDispositions.filter((item) =>
    validCandidateIds.has(item.candidate)
  );

  const accounted = new Set(reconciled.candidateDispositions.map((item) => item.candidate));
  for (const mention of reconciled.mentions) {
    for (const id of mention.candidateRefs) accounted.add(id);
  }

  const unresolvedCandidates = [];
  for (const candidate of revisedPacket.preflight.candidates) {
    if (accounted.has(candidate.id)) continue;
    const containing = reconciled.mentions.filter((mention) => candidateInsideMention(candidate, mention));
    if (containing.length === 1) {
      containing[0].candidateRefs.push(candidate.id);
      accounted.add(candidate.id);
    } else {
      unresolvedCandidates.push(candidate.id);
    }
  }

  for (const mention of reconciled.mentions) {
    mention.candidateRefs.sort((left, right) =>
      (candidateOrder.get(left) ?? Number.MAX_SAFE_INTEGER) -
      (candidateOrder.get(right) ?? Number.MAX_SAFE_INTEGER)
    );
  }

  return { extraction: reconciled, unresolvedCandidates };
}
