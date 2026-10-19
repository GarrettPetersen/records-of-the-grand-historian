import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { sha256, contentUnits, validateUnitIds, setTranslationField, writeJsonAtomic } from './people-content.mjs';
import { buildPeopleExtractionPacket } from '../build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../validate-people-extraction.mjs';
import { loadProperNounMatcher } from './people-candidates.mjs';
import { editorialReviews, validateAppliedEditorialDecisions } from './people-editorial-decisions.mjs';
import { buildDateAuditPacket, validateDateAuditReport, dateAuditReferencesCurrent } from './people-date-audit.mjs';

export const documentHash = value => sha256(JSON.stringify(value));
export function requireEqual(actual, expected, label) {
  if (!isDeepStrictEqual(actual, expected)) throw new Error(`Combined curation mismatch: ${label}`);
}
const requireTrue = (value, label) => requireEqual(value, true, label);
const shortId = id => id.split(':').at(-1);

function exactFields(value, expected, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Missing ${label}`);
  requireEqual(Object.keys(value).sort(), [...expected].sort(), `${label} fields`);
}

// Moves run before English repairs. Whole paragraph payloads are carried intact;
// indices are sequential and toBlockIndex is the final index after removal.
export function replayCombinedSourceReordering(beforeSource, contract, { book, chapter }) {
  exactFields(contract, ['schemaVersion', 'kind', 'book', 'chapter', 'authorAgentId', 'beforeSourceHash', 'reorderedSourceHash', 'beforeUnitOrder', 'afterUnitOrder', 'moves'], 'source reordering contract');
  requireEqual([contract.schemaVersion, contract.kind, contract.book, contract.chapter],
    [1, 'source-unit-reordering', book, chapter], 'source reordering protocol and scope');
  if (typeof contract.authorAgentId !== 'string' || !contract.authorAgentId.trim()) throw new Error('Missing source reordering author');
  requireEqual(documentHash(beforeSource), contract.beforeSourceHash, 'source reordering exact before');
  const units = contentUnits(beforeSource);
  validateUnitIds(units, 'source reordering before');
  requireEqual(units.map(u => u.id), contract.beforeUnitOrder, 'source reordering before unit order');
  if (!Array.isArray(contract.moves) || !contract.moves.length) throw new Error('Source reordering requires explicit moves');
  const replay = structuredClone(beforeSource);
  for (const move of contract.moves) {
    exactFields(move, ['kind', 'fromBlockIndex', 'toBlockIndex', 'unitIds', 'block'], 'source reordering move');
    requireEqual(move.kind, 'move-paragraph-block', 'source reordering move kind');
    for (const index of [move.fromBlockIndex, move.toBlockIndex]) {
      if (!Number.isInteger(index) || index < 0 || index >= replay.content.length) throw new Error('Source reordering block index out of range');
    }
    if (move.fromBlockIndex === move.toBlockIndex) throw new Error('Source reordering move is a no-op');
    const block = replay.content[move.fromBlockIndex];
    if (block.type !== 'paragraph' || !Array.isArray(block.sentences) || !block.sentences.length || Object.hasOwn(block, 'cells')) {
      throw new Error('Source reordering supports only complete nonempty paragraph blocks');
    }
    requireEqual(block, move.block, 'source reordering exact block payload');
    requireEqual(block.sentences.map(u => u.id), move.unitIds, 'source reordering moved unit IDs');
    replay.content.splice(move.fromBlockIndex, 1);
    replay.content.splice(move.toBlockIndex, 0, block);
  }
  requireEqual(contentUnits(replay).map(u => u.id), contract.afterUnitOrder, 'source reordering after unit order');
  if (isDeepStrictEqual(contract.beforeUnitOrder, contract.afterUnitOrder)) throw new Error('Source reordering has no net order change');
  requireEqual(documentHash(replay), contract.reorderedSourceHash, 'source reordering exact reordered source');
  return replay;
}

function reviewedSourceReordering(beforeSource, materialization, identity, dateReport, validation, seal, scope) {
  const contract = materialization.sourceReordering;
  const hash = contract === undefined ? undefined : documentHash(contract);
  for (const report of [identity.reviewContext, dateReport.reviewContext, validation, seal]) {
    requireEqual(report?.sourceReorderingHash, hash, 'reviewed source reordering hash');
  }
  if (contract === undefined) {
    requireEqual(identity.sourceReorderingReview, undefined, 'source reordering review without a contract');
    return structuredClone(beforeSource);
  }
  const replay = replayCombinedSourceReordering(beforeSource, contract, scope);
  exactFields(identity.sourceReorderingReview, ['id', 'verdict', 'reason', 'evidence'], 'source reordering approval');
  checks([identity.sourceReorderingReview], [{ id: hash }], new Map(contentUnits(beforeSource).map(u => [u.id, u])), 'source reordering', () => {});
  return replay;
}

// Follow run provenance, not arbitrary nested author declarations. Chunk records
// use the same agentId field; the production schema validates their shape.
function extractionAuthors(run, authors) {
  if (run?.agentId) authors.add(run.agentId);
  for (const chunk of run?.chunks ?? []) extractionAuthors(chunk, authors);
}

function incomingEditorialReview(before, after, reports) {
  const old = editorialReviews(before), current = editorialReviews(after);
  for (const review of old) {
    if (!current.some(r => isDeepStrictEqual(r, review))) throw new Error('Combined curation must retain old editorial reviews unchanged');
  }
  const additions = current.filter(r => !old.some(previous => isDeepStrictEqual(previous, r)));
  if (additions.length !== 1) throw new Error('Combined source amendment requires exactly one new editorial review component');
  for (const report of reports) requireEqual(report.reviewContext?.editorialDecisionHash, documentHash(additions[0]), 'reviewed incoming editorial component');
  return additions[0];
}

function sealedJson(pin, seal) {
  if (!pin || !path.isAbsolute(pin.file ?? '')) throw new Error('Missing sealed dependency review evidence');
  const protectedPin = seal.protectedFiles?.find(p => p.file === pin.file);
  requireEqual(protectedPin, pin, 'dependency evidence must be protected by the current seal');
  const bytes = fs.readFileSync(pin.file);
  requireEqual([`sha256:${createHash('sha256').update(bytes).digest('hex')}`, bytes.length], [pin.sha256, pin.bytes], 'sealed dependency evidence bytes');
  return JSON.parse(bytes);
}

// A dependency-only revalidation retains the original full review; it does not
// manufacture a new coverage verdict or relax any production/source check.
function validateRetainedCoverage(validation, seal, identity, dateReport) {
  requireEqual(validation.validationKind, 'dependency-delta-revalidation-not-a-new-chapter-review', 'retained validation kind');
  requireEqual(validation.completeIdentityEvidenceCoverage, 'retained-unchanged-approved-report', 'retained identity coverage');
  requireEqual(seal.reviewKind, 'retained-full-review-with-new-independent-dependency-review', 'retained seal kind');
  requireEqual(validation.dependencyChangeAddendum, seal.dependencyChangeAddendum, 'dependency addendum pin');
  const addendum = sealedJson(seal.dependencyChangeAddendum, seal);
  const original = sealedJson(validation.originalValidation, seal);
  const priorSeal = sealedJson(seal.priorSeal, seal);
  requireEqual(addendum.status, 'approved-dependency-delta-prior-conclusions-retained', 'independent dependency approval');
  requireEqual(addendum.findings, [], 'dependency findings');
  for (const record of [addendum, original]) {
    requireEqual([record.sourceHash, record.extractionHash, record.identityReviewHash, record.dateReportHash, record.reviewerId],
      [identity.sourceHash, identity.extractionHash, documentHash(identity), documentHash(dateReport), identity.reviewer.agentId], 'retained review identity and generation');
  }
  requireEqual(original.status, validation.status, 'original full approval');
  requireTrue(original.completeIdentityEvidenceCoverage, 'original complete identity coverage');
  requireEqual([priorSeal.sourceHash, priorSeal.extractionHash, priorSeal.reviewer?.agentId],
    [identity.sourceHash, identity.extractionHash, identity.reviewer.agentId], 'original source review seal');
  for (const record of [validation, seal, addendum]) requireEqual(record.originalFullReviewAt, identity.reviewedAt, 'original full review timestamp');
  requireEqual([validation.priorFullReviewChecks?.file, validation.priorFullReviewChecks?.sha256], [validation.originalValidation.file, validation.originalValidation.sha256], 'retained coverage reference');
  requireTrue(validation.priorFullReviewChecks.unchangedSourceAndReports, 'unchanged full review inputs');
  requireEqual(addendum.originalArchives, [seal.priorSeal, validation.originalValidation], 'complete original approval archives');
  const reportDocuments = addendum.retainedReports?.map(pin => sealedJson(pin, seal));
  if (reportDocuments?.length !== 2 || !reportDocuments.some(r => isDeepStrictEqual(r, identity)) || !reportDocuments.some(r => isDeepStrictEqual(r, dateReport))) throw new Error('Dependency approval must retain both exact independent reports');
  requireEqual([addendum.candidateByteHash, addendum.sourceByteHash],
    [identity.reviewContext.candidateByteHash, identity.reviewContext.sourceByteHash], 'unchanged dependency-review candidate bytes');
  const dependency = addendum.dependency;
  requireEqual(validation.authorizedDependencyChange, { file: dependency?.file, beforeHash: dependency?.beforeHash, afterHash: dependency?.afterHash }, 'authorized dependency delta');
  requireEqual([priorSeal.protectedFiles?.find(p => p.file === dependency.file)?.sha256, seal.protectedFiles.find(p => p.file === dependency.file)?.sha256],
    [dependency.beforeHash, dependency.afterHash], 'reviewed dependency before/after pins');
  for (const pin of priorSeal.protectedFiles) {
    if (pin.file !== dependency.file) requireEqual(seal.protectedFiles.find(p => p.file === pin.file), pin, 'unrelated original protected input changed');
  }
}

function checks(rows, expected, units, label, compare) {
  if (!Array.isArray(rows)) throw new Error(`Missing ${label} coverage`);
  requireEqual(rows.map(r => r.id).sort(), expected.map(r => r.id).sort(), `${label} coverage`);
  if (new Set(rows.map(r => r.id)).size !== rows.length) throw new Error(`Duplicate ${label} checks`);
  const byId = new Map(expected.map(r => [r.id, r]));
  for (const row of rows) {
    requireEqual(row.verdict, 'supported', `${label} approval ${row.id}`);
    if (typeof row.reason !== 'string' || row.reason.trim().length < 20) throw new Error(`Missing ${label} reasoning`);
    if (!Array.isArray(row.evidence) || !row.evidence.length) throw new Error(`Missing ${label} evidence`);
    for (const e of row.evidence) {
      if (typeof e.quote !== 'string' || !e.quote.trim() || !units.get(e.unit)?.zh.includes(e.quote)) throw new Error(`Invalid ${label} source evidence`);
    }
    compare(row, byId.get(row.id));
  }
}

function independent(reviewer, authors) {
  if (!reviewer?.agentId || !reviewer.name || authors.has(reviewer.agentId)) throw new Error('Unidentified or self-approved combined curation reviewer');
  if (reviewer.actualAgentId !== undefined) requireEqual(reviewer.actualAgentId, reviewer.agentId, 'actual reviewer identity');
  requireTrue(reviewer.independentOfExtractor, 'extractor independence');
  requireTrue(reviewer.independentOfRepairAuthor, 'repair author independence');
  for (const worker of reviewer.workers ?? []) independent(worker, authors);
}

// Use the production packet builder without ever materializing the candidate in
// canonical paths. Its source override is filesystem-based, hence this scratch dir.
export function combinedDatePacket(book, chapter, source, extraction) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'combined-date-packet-'));
  try {
    writeJsonAtomic(path.join(directory, book, `${chapter}.json`), source);
    return buildDateAuditPacket(book, chapter, { dataDir: directory, extraction });
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}

export function validateCombinedReviews({ book, chapter, source, candidate, editorial, identity, dateReport, validation, materialization, seal, beforeSource, beforeExtraction, beforeEditorial, authorAgentIds }, { dataDir }) {
  requireEqual(candidate.schemaVersion, 2, 'compact candidate version');
  requireEqual([candidate.book, candidate.chapter], [book, chapter], 'candidate scope');
  requireEqual([editorial.book, editorial.chapter], [book, chapter], 'editorial scope');
  const packet = buildPeopleExtractionPacket(book, chapter, { chapterData: source, properNounMatcher: loadProperNounMatcher() });
  const result = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
  const expanded = result.normalized;
  if (expanded.translationRepairs.some(r => r.status === 'proposed')) throw new Error('Combined curation retains proposed repairs');
  validateAppliedEditorialDecisions(editorial, expanded);
  const reviews = editorialReviews(editorial);
  const incoming = incomingEditorialReview(beforeEditorial, editorial, [identity, dateReport]);
  // Replay only explicitly reviewed whole-block moves, then the independently
  // accepted English repairs using their final source locators.
  const replay = reviewedSourceReordering(beforeSource, materialization, identity, dateReport, validation, seal, { book, chapter });
  for (const old of beforeExtraction.translationRepairs) {
    if (!candidate.translationRepairs.some(r => isDeepStrictEqual(r, old))) throw new Error('Old translation repair history changed');
  }
  let sourceRepairs = 0;
  for (const [index, row] of candidate.translationRepairs.entries()) {
    if (beforeExtraction.translationRepairs.some(old => isDeepStrictEqual(old, row))) continue;
    const repair = expanded.translationRepairs[index];
    if (repair.status !== 'applied' || !['literal', 'idiomatic'].includes(repair.field)) throw new Error('Source edit is not an applied translation repair');
    const approved = incoming.decisions.some(d => {
      const p = incoming.proposals.find(p => p.id === d.repairId);
      return d.decision !== 'reject' && p?.unit.id === repair.unit.id && p.field === repair.field && p.before === repair.before &&
        (d.decision === 'revise' ? d.after : p.after) === repair.after && d.reason === repair.reason;
    });
    if (!approved) throw new Error('Source edit lacks approval by the pinned incoming editorial component');
    sourceRepairs++;
    setTranslationField(replay, repair.unit, repair.field, repair.before, repair.after);
  }
  if (!sourceRepairs) throw new Error('Combined source amendment requires new applied translation repairs');
  requireEqual(replay, source, 'unrelated source edit outside reviewed translation repairs and source reordering');
  requireEqual(candidate.run, beforeExtraction.run, 'extractor provenance must not be rewritten');

  const dates = combinedDatePacket(book, chapter, source, candidate);
  const hashes = [dates.sourceHash, dates.extractionHash];
  for (const [label, r] of Object.entries({ identity, dateReport, validation, materialization, seal })) {
    requireEqual([r.sourceHash, r.extractionHash], hashes, `${label} exact candidate hashes`);
  }
  if (!Array.isArray(authorAgentIds) || !authorAgentIds.length || authorAgentIds.some(id => typeof id !== 'string' || !id.trim())) throw new Error('Declare all curation author agent IDs');
  const authors = new Set(authorAgentIds);
  for (const id of [candidate.run.agentId, identity.reviewContext?.amendmentAuthor, materialization.sourceReordering?.authorAgentId, ...(seal.reviewer?.excludedAuthorAgentIds ?? [])]) {
    if (id && !authors.has(id)) throw new Error(`Missing declared curation author ${id}`);
  }
  const actualExtractors = new Set();
  extractionAuthors(beforeExtraction.run, actualExtractors);
  extractionAuthors(candidate.run, actualExtractors);
  for (const id of actualExtractors) authors.add(id);
  for (const r of [identity, dateReport, seal]) independent(r.reviewer, authors);
  requireEqual(identity.reviewer.agentId, seal.reviewer.agentId, 'identity reviewer seal');
  requireEqual(dateReport.reviewer.agentId, seal.reviewer.agentId, 'date reviewer seal');
  for (const r of reviews) {
    if (!r.reviewer?.agentId || authors.has(r.reviewer.agentId)) throw new Error('Self-approved or unidentified editorial amendment');
  }
  for (const id of actualExtractors) if (!authorAgentIds.includes(id)) throw new Error(`Missing declared extraction author ${id}`);
  requireEqual(identity.schemaVersion, 1, 'identity report version');
  requireEqual(identity.reportType, 'complete-independent-source-identity-review', 'identity report type');
  requireEqual([identity.book, identity.chapter, identity.status, identity.approved], [book, chapter, 'approved', true], 'identity approval');
  if (!Number.isFinite(Date.parse(identity.reviewedAt)) || typeof identity.summary !== 'string' || identity.summary.length < 20) throw new Error('Missing identity review provenance');
  requireEqual(identity.findings, [], 'unresolved identity findings');
  validateDateAuditReport(dateReport, dates);
  requireEqual(dateReport.status, 'audited', 'date approval');
  // Identity references share the production date reference contract.
  validateDateAuditReport({ ...dateReport, references: identity.references }, dates);
  for (const r of [identity, dateReport]) {
    const own = r.references.filter(ref => ref.kind !== 'external' && ref.book === book && ref.chapter === chapter);
    for (const ref of own) {
      const unit = dates.units.find(u => u.id === ref.unit);
      if (!unit || sha256(unit.zh) !== ref.sourceHash || !unit.zh.includes(ref.quote)) throw new Error('Stale same-chapter review reference');
    }
    const others = r.references.filter(ref => !own.includes(ref));
    if (!dateAuditReferencesCurrent({ references: others }, { dataDir })) throw new Error('Stale combined review reference');
  }
  const units = new Map(packet.units.map(u => [u.id, u]));
  const covered = (rows, expected, label, compare) => checks(rows, expected, units, label, compare);
  covered(identity.unitChecks, packet.units, 'source unit', (r, u) => {
    requireEqual([r.sourceHash, r.englishHash, r.literalHash], [sha256(u.zh), sha256(u.en), sha256(u.literal)], 'reviewed source unit text');
    requireEqual(r.mentions, expanded.mentions.filter(m => m.unit.id === u.id).map(m => m.id), 'unit mention coverage');
  });
  covered(identity.personChecks, candidate.people.map(p => ({ id: p[0], names: p[1] })), 'person', (r, p) => requireEqual(r.names, p.names, 'reviewed person names'));
  const names = candidate.people.flatMap((p, i) => (p[5] ?? []).map((claim, j) => ({ id: `name-${p[0]}-${j + 1}`, path: `/people/${i}/5/${j}`, personId: p[0], claim })));
  covered(identity.nameClaimChecks, names, 'name claim', (r, p) => {
    for (const k of ['path', 'personId', 'claim']) requireEqual(r[k], p[k], `reviewed name ${k}`);
  });
  const family = candidate.claims.flatMap((c, i) => c[1] === 'family-relationship' ? [{ id: `claim-${i + 1}`, subject: c[0], value: c[2], certainty: c[3] }] : []);
  covered(identity.familyRelationshipChecks, family, 'family relationship', (r, c) => {
    for (const k of ['subject', 'value', 'certainty']) requireEqual(r[k], c[k], `reviewed family ${k}`);
  });
  covered(identity.mentionChecks, expanded.mentions, 'mention', (r, m) => {
    requireEqual([r.personId, r.unit, r.kind, r.spans, r.candidateRefs], [shortId(m.person), m.unit.id, m.kind, m.spans, m.candidateRefs], 'reviewed mention contract');
  });
  covered(identity.candidateChecks, packet.preflight.candidates, 'scanner candidate', (r, c) => {
    for (const k of ['unit', 'language', 'exact', 'occurrence', 'startCodePoint', 'endCodePoint']) requireEqual(r[k], c[k], `reviewed candidate ${k}`);
    const mentions = expanded.mentions.filter(m => m.candidateRefs.includes(c.id));
    requireEqual(r.mentionIds, mentions.map(m => m.id), 'candidate mention owners');
    requireEqual(r.personalOwners, [...new Set(mentions.map(m => shortId(m.person)))], 'candidate personal owners');
    requireEqual(r.disposition, expanded.candidateDispositions.find(d => d.candidate === c.id) ?? null, 'candidate disposition');
  });
  const collective = identity.collectiveOccurrenceChecks;
  covered(collective, collective ?? [], 'collective occurrence', r => {
    requireEqual(r.personalOwner, null, 'collective must not have a personal owner');
    if (!['en', 'zh'].includes(r.language)) throw new Error('Unknown collective language');
    const text = units.get(r.unit)?.[r.language], span = r.span;
    if (!text || !span || sha256(text) !== span.unitTextHash || [...text].slice(span.startCodePoint, span.endCodePoint).join('') !== span.exact) throw new Error('Stale collective occurrence');
    if (expanded.mentions.some(m => m.unit.id === r.unit && m.spans[r.language].some(s => s.startCodePoint < span.endCodePoint && s.endCodePoint > span.startCodePoint))) throw new Error('Collective occurrence overlaps a personal mention');
  });
  for (const [key, count] of Object.entries({ sourceUnits: packet.units.length, people: candidate.people.length, nameClaims: names.length, familyRelationships: family.length, personalMentions: expanded.mentions.length, scannerCandidates: packet.preflight.candidates.length, candidateDispositions: expanded.candidateDispositions.length, collectiveOccurrences: collective.length, temporalItems: dates.items.length })) requireEqual(identity.coverage?.[key], count, `identity ${key} count`);
  for (const key of ['allSourceUnitsRead', 'allStoredMentionsChecked', 'unscannedCallbacksChecked', 'namedPeopleAndDefiniteCallbacksComplete']) requireTrue(identity.coverage?.[key], key);
  requireEqual(identity.coverage.omittedNamedPeopleFound, 0, 'omitted people');
  for (const rows of [identity.originalCurationChecks, identity.v3FixChecks]) {
    if (rows !== undefined) covered(rows, rows, 'curation finding', () => {});
  }
  requireEqual(validation.identityReviewHash, documentHash(identity), 'identity report seal');
  requireEqual(validation.dateReportHash, documentHash(dateReport), 'date report seal');
  if (!['approved-exact-editorial-amended-candidate', 'approved-exact-combined-candidate'].includes(validation.status)) throw new Error('Combined validation does not approve the exact candidate');
  requireEqual(validation.reviewerId, identity.reviewer.agentId, 'validation reviewer');
  if (validation.validationKind !== undefined) validateRetainedCoverage(validation, seal, identity, dateReport);
  else requireTrue(validation.completeIdentityEvidenceCoverage, 'completeIdentityEvidenceCoverage');
  for (const key of ['productionDateReportValid', 'productionAppliedEditorialValid', 'exactFreshDatePacket', 'allProtectedBytesUnchanged']) requireTrue(validation[key], key);
  requireEqual(validation.productionExtractionStats, result.stats, 'production validation stats');
  requireEqual(validation.strictAliasDispositionConflicts, [], 'strict alias conflicts');
  requireEqual(validation.dateGeometryReceptionDiagnostics, [], 'date diagnostics');
  return { packet: dates, stats: result.stats };
}
