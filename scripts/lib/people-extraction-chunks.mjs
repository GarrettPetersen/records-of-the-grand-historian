import { buildInputFingerprint } from './people-content.mjs';
import { buildCompactInput } from './people-compact.mjs';

function positiveInteger(value, label) {
  if (!Number.isInteger(value) || value < 1) throw new Error(`${label} must be a positive integer`);
  return value;
}

function candidateCountsByUnit(packet) {
  const counts = new Map(packet.units.map((unit) => [unit.id, 0]));
  for (const candidate of packet.preflight.candidates) {
    if (!counts.has(candidate.unit)) {
      throw new Error(`Candidate ${candidate.id} refers to missing unit ${candidate.unit}`);
    }
    counts.set(candidate.unit, counts.get(candidate.unit) + 1);
  }
  return counts;
}

export function planPeopleExtractionChunks(packet, options = {}) {
  const maxUnits = positiveInteger(options.maxUnits ?? 250, 'maxUnits');
  const maxCandidates = positiveInteger(options.maxCandidates ?? 600, 'maxCandidates');
  const contextUnits = Number.isInteger(options.contextUnits) && options.contextUnits >= 0
    ? options.contextUnits
    : 6;
  const counts = candidateCountsByUnit(packet);
  const chunks = [];
  let start = 0;

  while (start < packet.units.length) {
    let end = start;
    let candidateCount = 0;
    let lastBlockBoundary = null;
    while (end < packet.units.length) {
      const nextCandidates = counts.get(packet.units[end].id);
      const exceeds = end > start && (
        end - start + 1 > maxUnits || candidateCount + nextCandidates > maxCandidates
      );
      if (exceeds) break;
      candidateCount += nextCandidates;
      end += 1;
      if (end === packet.units.length || packet.units[end - 1].blockIndex !== packet.units[end].blockIndex) {
        lastBlockBoundary = { end, candidateCount };
      }
      if (end - start >= maxUnits || candidateCount >= maxCandidates) break;
    }

    if (end === start) end += 1;
    if (
      lastBlockBoundary &&
      lastBlockBoundary.end < end &&
      (
        lastBlockBoundary.end - start >= Math.max(1, Math.floor(maxUnits / 2)) ||
        lastBlockBoundary.candidateCount >= Math.max(1, Math.floor(maxCandidates / 2))
      )
    ) {
      end = lastBlockBoundary.end;
      candidateCount = lastBlockBoundary.candidateCount;
    }

    chunks.push({
      index: chunks.length,
      id: String(chunks.length + 1).padStart(3, '0'),
      start,
      end,
      contextStart: Math.max(0, start - contextUnits),
      contextEnd: Math.min(packet.units.length, end + contextUnits),
      units: end - start,
      candidates: candidateCount,
      singleUnitOverCeiling: end - start === 1 && candidateCount > maxCandidates,
    });
    start = end;
  }

  const count = chunks.length;
  return chunks.map((chunk) => ({ ...chunk, count, maxUnits, maxCandidates, contextUnits }));
}

export function buildPeopleChunkPacket(packet, chunk) {
  if (!Number.isInteger(chunk.start) || !Number.isInteger(chunk.end) ||
      chunk.start < 0 || chunk.end <= chunk.start || chunk.end > packet.units.length) {
    throw new Error(`Invalid chunk ownership range ${chunk.start}:${chunk.end}`);
  }
  const units = packet.units.slice(chunk.start, chunk.end);
  const unitIds = new Set(units.map((unit) => unit.id));
  return {
    ...packet,
    input: buildInputFingerprint(units),
    units,
    preflight: {
      ...packet.preflight,
      candidates: packet.preflight.candidates.filter((candidate) => unitIds.has(candidate.unit)),
    },
  };
}

function mapLocalIds(value, ids) {
  if (Array.isArray(value)) return value.map((item) => mapLocalIds(item, ids));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mapLocalIds(item, ids)]));
  }
  return typeof value === 'string' && ids.has(value) ? ids.get(value) : value;
}

function rebaseCompactExtraction(compact, firstPersonNumber) {
  const ids = new Map(compact.people.map(([id], index) => [
    id,
    `p${String(firstPersonNumber + index).padStart(3, '0')}`,
  ]));
  const people = compact.people.map(([id, preferred, historicity, descriptor, hints, names, roles]) => [
    ids.get(id),
    preferred,
    historicity,
    descriptor,
    mapLocalIds(hints, ids),
    mapLocalIds(names, ids),
    mapLocalIds(roles, ids),
  ]);
  return {
    people,
    surfaces: compact.surfaces.map(([person, ...rest]) => [ids.get(person), ...rest]),
    claims: compact.claims.map(([subject, predicate, value, certainty, evidence]) => [
      ids.get(subject),
      predicate,
      mapLocalIds(value, ids),
      certainty,
      evidence,
    ]),
  };
}

function mergeDispositionGroups(groups) {
  const merged = new Map();
  for (const [disposition, reason, entries] of groups) {
    const key = `${disposition}\u0000${reason}`;
    if (!merged.has(key)) merged.set(key, [disposition, reason, []]);
    merged.get(key)[2].push(...entries);
  }
  return [...merged.values()];
}

export function assembleCompactPeopleChunks(packet, parts, run) {
  if (parts.length === 0) throw new Error('Cannot assemble an empty chunk list');
  const ordered = [...parts].sort((left, right) => left.chunk.index - right.chunk.index);
  let expectedStart = 0;
  let nextPersonNumber = 1;
  const people = [];
  const surfaces = [];
  const claims = [];
  const translationRepairs = [];
  const dispositions = [];
  const unresolvedReferences = [];

  for (const { chunk, extraction } of ordered) {
    if (chunk.start !== expectedStart) {
      throw new Error(`Chunk ${chunk.id} starts at ${chunk.start}; expected ${expectedStart}`);
    }
    expectedStart = chunk.end;
    const expectedInput = buildCompactInput(buildPeopleChunkPacket(packet, chunk));
    if (JSON.stringify(extraction.input) !== JSON.stringify(expectedInput)) {
      throw new Error(`Chunk ${chunk.id} input does not match its ownership range`);
    }
    const rebased = rebaseCompactExtraction(extraction, nextPersonNumber);
    nextPersonNumber += rebased.people.length;
    people.push(...rebased.people);
    surfaces.push(...rebased.surfaces);
    claims.push(...rebased.claims);
    translationRepairs.push(...extraction.translationRepairs);
    dispositions.push(...extraction.candidateDispositions);
    unresolvedReferences.push(...extraction.coverage.unresolvedReferences);
  }
  if (expectedStart !== packet.units.length) {
    throw new Error(`Chunk coverage ends at ${expectedStart}; chapter has ${packet.units.length} units`);
  }

  return {
    schemaVersion: 2,
    book: packet.book,
    chapter: packet.chapter,
    input: buildCompactInput(packet),
    run,
    people,
    surfaces,
    claims,
    translationRepairs,
    candidateDispositions: mergeDispositionGroups(dispositions),
    coverage: {
      allUnitsVisited: true,
      preflightCandidatesAccountedFor: true,
      allNamedPeopleAndMentionsCaptured: true,
      allDurableFactsCaptured: true,
      allChronologyCaptured: true,
      editorialPassCompleted: true,
      unresolvedReferences,
    },
  };
}
