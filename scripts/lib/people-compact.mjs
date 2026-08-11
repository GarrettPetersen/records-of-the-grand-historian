import { exactSpanAt, sha256 } from './people-content.mjs';

const PERSON_PREFIX = /^p\d{3,}$/u;

function shortLocalId(value, namespace) {
  return typeof value === 'string' && value.startsWith(`${namespace}:`)
    ? value.slice(namespace.length + 1)
    : value;
}

function expandLocalId(value, namespace) {
  return typeof value === 'string' && PERSON_PREFIX.test(value) ? `${namespace}:${value}` : value;
}

function mapNested(value, mapper) {
  if (Array.isArray(value)) return value.map((item) => mapNested(item, mapper));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mapNested(item, mapper)]));
  }
  return mapper(value);
}

function compactEvidence(evidence, namespace) {
  return evidence.map((item) => shortLocalId(item, namespace));
}

function expandEvidence(evidence, namespace) {
  return evidence.map((item) => item.startsWith(`${namespace}:`) ? item : `${namespace}:${item}`);
}

function combinedUnitDigest(digest) {
  return sha256(JSON.stringify([digest.zh, digest.en, digest.literal])).slice('sha256:'.length, 'sha256:'.length + 24);
}

export function buildCompactInput(packet) {
  return {
    unitCount: packet.input.unitCount,
    chapterFingerprint: packet.input.chapterFingerprint,
    candidateScannerVersion: packet.preflight.scannerVersion,
    unitDigests: packet.input.unitDigests.map((digest) => [digest.id, combinedUnitDigest(digest)]),
  };
}

export function compactInputErrors(compact, packet) {
  const errors = [];
  if (compact.book !== packet.book || compact.chapter !== packet.chapter) {
    errors.push(`compact scope ${compact.book}/${compact.chapter} does not match packet ${packet.book}/${packet.chapter}`);
  }
  const expected = buildCompactInput(packet);
  if (JSON.stringify(compact.input) !== JSON.stringify(expected)) {
    errors.push('compact input fingerprints or unit digests do not match the current packet');
  }
  return errors;
}

function surfaceRows(extraction, packet, namespace) {
  const groups = new Map();
  for (const mention of extraction.mentions) {
    for (const language of ['zh', 'en']) {
      for (const span of mention.spans[language]) {
        const person = shortLocalId(mention.person, namespace);
        const key = JSON.stringify([person, mention.kind, language, span.exact]);
        if (!groups.has(key)) {
          groups.set(key, {
            person,
            kind: mention.kind,
            language,
            exact: span.exact,
            units: new Map(),
          });
        }
        const group = groups.get(key);
        if (!group.units.has(mention.unit.id)) group.units.set(mention.unit.id, new Set());
        group.units.get(mention.unit.id).add(span.occurrence);
      }
    }
  }
  const unitOrder = new Map(packet.units.map((unit, index) => [unit.id, index]));
  return [...groups.values()].map((group) => [
    group.person,
    group.kind,
    group.language,
    group.exact,
    [...group.units.entries()]
      .sort((left, right) => unitOrder.get(left[0]) - unitOrder.get(right[0]))
      .map(([unit, occurrences]) => [unit, [...occurrences].sort((left, right) => left - right)]),
  ]);
}

function dispositionGroups(extraction, namespace) {
  const groups = new Map();
  for (const item of extraction.candidateDispositions) {
    const key = `${item.disposition}:${item.reason}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push([shortLocalId(item.candidate, namespace), item.note ?? null]);
  }
  return [...groups.entries()].map(([key, entries]) => {
    const separator = key.indexOf(':');
    return [key.slice(0, separator), key.slice(separator + 1), entries];
  });
}

export function compactPeopleExtraction(extraction, packet) {
  const namespace = `${packet.book}:${packet.chapter}`;
  const claimsByPerson = new Map();
  for (const claim of extraction.claims) {
    if (!claimsByPerson.has(claim.subject)) claimsByPerson.set(claim.subject, []);
    claimsByPerson.get(claim.subject).push(claim);
  }

  const people = extraction.people.map((person) => {
    const claims = claimsByPerson.get(person.localId) ?? [];
    const names = claims.filter((claim) => claim.predicate === 'name').map((claim) => [
      mapNested(claim.value, (value) => shortLocalId(value, namespace)),
      claim.certainty,
      compactEvidence(claim.evidence, namespace),
    ]);
    const roles = claims.filter((claim) => claim.predicate === 'role').map((claim) => [
      claim.value.roleId,
      claim.certainty,
      compactEvidence(claim.evidence, namespace),
    ]);
    return [
      shortLocalId(person.localId, namespace),
      [
        person.preferredNameSuggestion.en ?? null,
        person.preferredNameSuggestion.zh ?? null,
        person.preferredNameSuggestion.pinyin ?? null,
      ],
      person.historicity,
      person.descriptorSuggestion,
      {
        n: person.identityHints.nativePlaces,
        r: person.identityHints.relatedLocalPeople.map((value) => shortLocalId(value, namespace)),
        a: person.identityHints.activeDateHints,
        p: person.identityHints.polityHints ?? [],
        x: person.mentionException ?? null,
      },
      names,
      roles,
    ];
  });

  const claims = extraction.claims
    .filter((claim) => claim.predicate !== 'name' && claim.predicate !== 'role')
    .map((claim) => [
      shortLocalId(claim.subject, namespace),
      claim.predicate,
      mapNested(claim.value, (value) => shortLocalId(value, namespace)),
      claim.certainty,
      compactEvidence(claim.evidence, namespace),
    ]);

  return {
    schemaVersion: 2,
    book: packet.book,
    chapter: packet.chapter,
    input: buildCompactInput(packet),
    run: extraction.run,
    people,
    surfaces: surfaceRows(extraction, packet, namespace),
    claims,
    translationRepairs: extraction.translationRepairs.map((repair) => [
      repair.unit.id,
      repair.field,
      repair.before,
      repair.after,
      repair.reason,
      repair.confidence,
      repair.status,
    ]),
    candidateDispositions: dispositionGroups(extraction, namespace),
    coverage: {
      ...extraction.coverage,
      unresolvedReferences: extraction.coverage.unresolvedReferences.map((item) => ({
        unit: shortLocalId(item.unit, namespace),
        description: item.description,
      })),
    },
  };
}

function expandPeople(compact, namespace) {
  return compact.people.map(([id, preferred, historicity, descriptor, hints]) => ({
    localId: `${namespace}:${id}`,
    preferredNameSuggestion: {
      ...(preferred[0] !== null ? { en: preferred[0] } : {}),
      ...(preferred[1] !== null ? { zh: preferred[1] } : {}),
      ...(preferred[2] !== null ? { pinyin: preferred[2] } : {}),
    },
    historicity,
    descriptorSuggestion: descriptor,
    identityHints: {
      nativePlaces: hints.n,
      relatedLocalPeople: hints.r.map((value) => `${namespace}:${value}`),
      activeDateHints: hints.a,
      ...(hints.p.length > 0 ? { polityHints: hints.p } : {}),
    },
    ...(hints.x !== null ? { mentionException: hints.x } : {}),
  }));
}

function expandClaims(compact, namespace) {
  const claims = [];
  const add = (subject, predicate, value, certainty, evidence) => {
    claims.push({
      id: `${namespace}:c${String(claims.length + 1).padStart(4, '0')}`,
      subject: `${namespace}:${subject}`,
      predicate,
      value: mapNested(value, (item) => expandLocalId(item, namespace)),
      certainty,
      evidence: expandEvidence(evidence, namespace),
    });
  };
  for (const [subject, _preferred, _historicity, _descriptor, _hints, names, roles] of compact.people) {
    for (const [value, certainty, evidence] of names) add(subject, 'name', value, certainty, evidence);
    for (const [roleId, certainty, evidence] of roles) add(subject, 'role', { roleId }, certainty, evidence);
  }
  for (const [subject, predicate, value, certainty, evidence] of compact.claims) {
    add(subject, predicate, value, certainty, evidence);
  }
  return claims;
}

function expandMentions(compact, packet, namespace, options = {}) {
  const unitById = new Map(packet.units.map((unit, order) => [unit.id, { ...unit, order }]));
  const disposedCandidates = new Set(
    expandDispositions(compact, namespace).map((item) => item.candidate),
  );
  const drafts = [];
  for (const [person, kind, language, exact, unitOccurrences] of compact.surfaces) {
    for (const [unitId, occurrences] of unitOccurrences) {
      const unit = unitById.get(unitId);
      if (!unit) continue;
      for (const occurrence of occurrences) {
        let located;
        try {
          located = exactSpanAt(unit[language], exact, occurrence);
        } catch (error) {
          if (!options.allowStaleSurfaces) throw error;
          located = {
            exact,
            occurrence,
            startCodePoint: Number.MAX_SAFE_INTEGER,
            endCodePoint: Number.MAX_SAFE_INTEGER,
            unitTextHash: null,
          };
        }
        drafts.push({
          person: `${namespace}:${person}`,
          unit,
          kind,
          language,
          span: located,
          candidateRefs: [],
        });
      }
    }
  }
  drafts.sort((left, right) =>
    left.unit.order - right.unit.order ||
    left.language.localeCompare(right.language) ||
    left.span.startCodePoint - right.span.startCodePoint ||
    right.span.endCodePoint - left.span.endCodePoint ||
    left.person.localeCompare(right.person)
  );

  for (const candidate of packet.preflight.candidates) {
    if (disposedCandidates.has(candidate.id)) continue;
    const containing = drafts.filter((mention) =>
      mention.unit.id === candidate.unit &&
      mention.language === candidate.language &&
      mention.span.startCodePoint <= candidate.startCodePoint &&
      mention.span.endCodePoint >= candidate.endCodePoint
    );
    if (containing.length === 1) containing[0].candidateRefs.push(candidate.id);
  }

  return drafts.map((draft, index) => ({
    id: `${namespace}:m${String(index + 1).padStart(4, '0')}`,
    person: draft.person,
    unit: {
      id: draft.unit.id,
      kind: draft.unit.kind,
      blockIndex: draft.unit.blockIndex,
      collection: draft.unit.collection,
      itemIndex: draft.unit.itemIndex,
    },
    kind: draft.kind,
    spans: {
      zh: draft.language === 'zh' ? [draft.span] : [],
      en: draft.language === 'en' ? [draft.span] : [],
    },
    candidateRefs: draft.candidateRefs,
  }));
}

function expandDispositions(compact, namespace) {
  const dispositions = [];
  for (const [disposition, reason, entries] of compact.candidateDispositions) {
    for (const [candidate, note] of entries) {
      dispositions.push({ candidate: `${namespace}:${candidate}`, disposition, reason, note });
    }
  }
  return dispositions;
}

export function expandPeopleExtraction(compact, packet, options = {}) {
  const namespace = `${packet.book}:${packet.chapter}`;
  return {
    schemaVersion: 1,
    book: packet.book,
    chapter: packet.chapter,
    input: packet.input,
    run: compact.run,
    people: expandPeople(compact, namespace),
    mentions: expandMentions(compact, packet, namespace, options),
    claims: expandClaims(compact, namespace),
    translationRepairs: compact.translationRepairs.map((repair, index) => {
      const [unitId, field, before, after, reason, confidence, status] = repair;
      const unit = packet.units.find((item) => item.id === unitId);
      return {
        id: `${namespace}:r${String(index + 1).padStart(4, '0')}`,
        unit: {
          id: unit.id,
          kind: unit.kind,
          blockIndex: unit.blockIndex,
          collection: unit.collection,
          itemIndex: unit.itemIndex,
        },
        field,
        before,
        after,
        reason,
        confidence,
        status,
      };
    }),
    candidateDispositions: expandDispositions(compact, namespace),
    coverage: {
      ...compact.coverage,
      unresolvedReferences: compact.coverage.unresolvedReferences.map((item) => ({
        unit: item.unit,
        description: item.description,
      })),
    },
  };
}

export function isCompactPeopleExtraction(value) {
  return value?.schemaVersion === 2;
}

function rowArray(name, rows, trailingComma = true) {
  const lines = [`  ${JSON.stringify(name)}: [`];
  for (const [index, row] of rows.entries()) {
    lines.push(`    ${JSON.stringify(row)}${index + 1 < rows.length ? ',' : ''}`);
  }
  lines.push(`  ]${trailingComma ? ',' : ''}`);
  return lines;
}

export function serializeCompactPeopleExtraction(compact) {
  const input = { ...compact.input, unitDigests: undefined };
  const lines = [
    '{',
    `  "schemaVersion": ${compact.schemaVersion},`,
    `  "book": ${JSON.stringify(compact.book)},`,
    `  "chapter": ${JSON.stringify(compact.chapter)},`,
    '  "input": {',
    `    "unitCount": ${input.unitCount},`,
    `    "chapterFingerprint": ${JSON.stringify(input.chapterFingerprint)},`,
    `    "candidateScannerVersion": ${input.candidateScannerVersion},`,
    '    "unitDigests": [',
  ];
  for (const [index, digest] of compact.input.unitDigests.entries()) {
    lines.push(`      ${JSON.stringify(digest)}${index + 1 < compact.input.unitDigests.length ? ',' : ''}`);
  }
  lines.push('    ]', '  },');
  lines.push(`  "run": ${JSON.stringify(compact.run)},`);
  lines.push(...rowArray('people', compact.people));
  lines.push(...rowArray('surfaces', compact.surfaces));
  lines.push(...rowArray('claims', compact.claims));
  lines.push(...rowArray('translationRepairs', compact.translationRepairs));
  lines.push(...rowArray('candidateDispositions', compact.candidateDispositions));
  lines.push(`  "coverage": ${JSON.stringify(compact.coverage)}`);
  lines.push('}', '');
  return lines.join('\n');
}
