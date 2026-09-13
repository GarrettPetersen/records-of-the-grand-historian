import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR, PEOPLE_DIR, contentUnits, readJson, sha256, writeJsonAtomic } from './people-content.mjs';
import { temporalContainers, westernBoundsErrors, westernYearOrder } from './people-date-values.mjs';

export const DATE_AUDIT_VERSION = 1;
export const DATE_AUDIT_STATES = ['un-audited', 'audited', 'needs-revision', 'research-blocked', 'stale'];
const TEMPORAL_KEYS = new Set(['westernYear', 'westernInterval', 'westernBounds', 'sourceDate', 'dateContext', 'startDate', 'endDate']);
const LIFE_PREDICATES = new Set(['attestation', 'birth', 'death', 'age']);

export function validateDateAuditScope(book, chapter) {
  if (!/^[a-z0-9_-]+$/.test(book) || !/^\d{3}$/.test(chapter)) throw new Error('Date audit requires book and three-digit chapter');
}

function hasTemporalValue(value) {
  return value && typeof value === 'object' && Object.entries(value).some(([key, child]) => TEMPORAL_KEYS.has(key) || hasTemporalValue(child));
}

export function dateAuditDiagnostics(packet) {
  return packet.items.flatMap(item => temporalContainers(item.value).flatMap(value => {
    const errors = [];
    const interval = value.westernInterval;
    if (interval?.start && interval?.end && westernYearOrder(interval.start) > westernYearOrder(interval.end)) errors.push('Western interval is reversed; verify era and endpoints against the source.');
    if (value.westernBounds) errors.push(...westernBoundsErrors(value.westernBounds));
    return errors.map(problem => ({ item: item.id, personId: item.personId, problem }));
  }));
}

export function dateAuditItems(extraction) {
  const compact = extraction.schemaVersion === 2;
  const people = extraction.people.map(person => compact
    ? { id: person[0], names: person[1], historicity: person[2], descriptor: person[3], hints: person[4]?.a ?? [] }
    : { id: person.localId, names: person.preferredName, historicity: person.historicity, descriptor: person.description, hints: person.identityHints?.activeDateHints ?? [] });
  const items = extraction.claims.flatMap((claim, index) => {
    const [personId, predicate, value, certainty, evidence] = compact
      ? claim : [claim.subject, claim.predicate, claim.value, claim.certainty, claim.evidence];
    if (!LIFE_PREDICATES.has(predicate) && !hasTemporalValue(value)) return [];
    return [{ id: `claim-${index + 1}`, claimIndex: index, personId, predicate, value, certainty,
      evidence: evidence.map(id => id.split(':').at(-1)), claimHash: sha256(JSON.stringify(claim)) }];
  });
  for (const person of people) items.push({ id: `hints-${person.id}`, personId: person.id, predicate: 'active-date-hints', value: person.hints, evidence: [] });
  return { people, items };
}

export function buildDateAuditPacket(book, chapter, { dataDir = DATA_DIR, peopleDir = PEOPLE_DIR } = {}) {
  validateDateAuditScope(book, chapter);
  const source = readJson(path.join(dataDir, book, `${chapter}.json`));
  const extraction = readJson(path.join(peopleDir, 'extractions', book, `${chapter}.json`));
  if (extraction.book !== book || extraction.chapter !== chapter) throw new Error('Date audit extraction scope mismatch');
  const units = contentUnits(source).map(({ id, zh, en, literal, blockIndex }) => ({ id, zh, en, literal, blockIndex }));
  const { people, items } = dateAuditItems(extraction);
  const unitIds = new Set(units.map(unit => unit.id));
  for (const item of items) if (item.evidence.some(id => !unitIds.has(id))) throw new Error(`Unknown date evidence in ${item.id}`);
  return { schemaVersion: 1, auditVersion: DATE_AUDIT_VERSION, book, chapter,
    sourceHash: sha256(JSON.stringify(units)), extractionHash: sha256(JSON.stringify(extraction)),
    sourceUrl: source.meta?.url ?? null, extractor: extraction.run, people, items, units,
    instructions: 'Review dates, event ownership, conversions, endpoint evidence, age reckoning, omitted life dates, and active-date hints. Read all Chinese units for omissions; English is not independent evidence. Do not re-extract names or mentions. For each item identify whose event is dated and justify each endpoint. Same mother does not imply same birth year. Later allusions are not personal activity. Research or record a blocker rather than invent precision. A report cannot approve with missing checks or unresolved research.' };
}

function nonempty(value, label, minimum = 1) {
  if (typeof value !== 'string' || value.trim().length < minimum) throw new Error(`${label} must be substantive text`);
}

function exactMembers(actual, expected, label, complete) {
  if (!Array.isArray(actual) || new Set(actual).size !== actual.length || actual.some(id => !expected.includes(id))) throw new Error(`${label} contains duplicate or unknown IDs`);
  if (complete && actual.length !== expected.length) throw new Error(`${label} does not cover the complete chapter`);
}

export function validateDateAuditReport(report, packet) {
  if (report.schemaVersion !== 1 || report.auditVersion !== DATE_AUDIT_VERSION || report.book !== packet.book || report.chapter !== packet.chapter) throw new Error('Date audit report version or scope mismatch');
  if (report.sourceHash !== packet.sourceHash || report.extractionHash !== packet.extractionHash) throw new Error('Date audit report is stale');
  if (!['audited', 'needs-revision', 'research-blocked'].includes(report.status)) throw new Error('Invalid date audit report status');
  nonempty(report.reviewer?.name, 'Reviewer');
  if (report.reviewer?.independentOfExtractor !== true) throw new Error('Date audit requires a separate source reviewer');
  if (!Number.isFinite(Date.parse(report.reviewedAt))) throw new Error('Invalid date audit timestamp');
  nonempty(report.summary, 'Audit summary', 20);
  if (!Array.isArray(report.itemChecks) || !Array.isArray(report.personChecks) || !Array.isArray(report.findings) || !Array.isArray(report.references)) throw new Error('Missing date audit checks, findings, or references');
  const complete = report.status === 'audited';
  if (complete && dateAuditDiagnostics(packet).length) throw new Error('Date approval retains invalid temporal geometry');
  exactMembers(report.reviewedUnits, packet.units.map(unit => unit.id), 'Reviewed units', complete);
  exactMembers(report.itemChecks.map(item => item.id), packet.items.map(item => item.id), 'Date checks', complete);
  exactMembers(report.personChecks.map(person => person.id), packet.people.map(person => person.id), 'Person checks', complete);
  const unitMap = new Map(packet.units.map(unit => [unit.id, unit]));
  for (const check of [...report.itemChecks, ...report.personChecks]) {
    if (!['supported', 'incorrect', 'research-blocked'].includes(check.verdict)) throw new Error(`Invalid verdict for ${check.id}`);
    nonempty(check.reason, `Reason for ${check.id}`, 20);
    if (report.itemChecks.includes(check)) nonempty(check.event, `Event ownership for ${check.id}`, 10);
    if (!Array.isArray(check.evidence) || !check.evidence.length) throw new Error(`Missing evidence for ${check.id}`);
    for (const citation of check.evidence) {
      nonempty(citation.quote, 'Source quotation');
      if (!unitMap.get(citation.unit)?.zh.includes(citation.quote)) throw new Error(`Quotation for ${check.id} is not in its Chinese source unit`);
    }
    if (check.verdict !== 'supported' && !report.findings.some(finding => finding.items.includes(check.id))) throw new Error(`Failed check ${check.id} has no finding`);
    if (complete && check.verdict !== 'supported') throw new Error('Date approval contradicts a failed check');
  }
  const known = [...packet.items.map(item => item.id), ...packet.people.map(person => person.id)];
  for (const finding of report.findings) {
    exactMembers(finding.items, known, 'Finding references', false);
    if (!finding.items.length) throw new Error('Finding must identify affected records');
    nonempty(finding.problem, 'Date finding', 20);
    nonempty(finding.action, 'Date finding action', 20);
  }
  for (const reference of report.references) {
    if (reference.kind === 'external') {
      const url = new URL(reference.url);
      if (!['https:', 'http:'].includes(url.protocol)) throw new Error('External date source must use HTTP(S)');
      nonempty(reference.title, 'Reference title');
      nonempty(reference.quote, 'Reference excerpt');
      nonempty(reference.reason, 'Reference interpretation', 20);
      if (!Number.isFinite(Date.parse(reference.accessedAt)) || reference.sourceHash !== sha256(reference.quote)) throw new Error('External reference requires a dated, hash-pinned excerpt');
      continue;
    }
    validateDateAuditScope(reference.book, reference.chapter);
    nonempty(reference.unit, 'Reference unit');
    nonempty(reference.quote, 'Reference quote');
    if (!/^sha256:[a-f0-9]{64}$/.test(reference.sourceHash)) throw new Error('Reference requires a pinned source hash');
    nonempty(reference.reason, 'Reference interpretation', 20);
  }
  if (complete && (report.findings.length || packet.items.some(item => temporalContainers(item.value).some(value => value.unresolved === true)))) throw new Error('Unresolved chronology cannot be approved');
  if (!complete && !report.findings.length) throw new Error('Unapproved audit requires actionable findings');
  return report;
}

export function dateAuditReferencesCurrent(report, { dataDir = DATA_DIR } = {}) {
  return report.references.every(reference => {
    if (reference.kind === 'external') return reference.sourceHash === sha256(reference.quote);
    const file = path.join(dataDir, reference.book, `${reference.chapter}.json`);
    if (!fs.existsSync(file)) return false;
    const unit = contentUnits(readJson(file)).find(unit => unit.id === reference.unit);
    return unit && sha256(unit.zh) === reference.sourceHash && unit.zh.includes(reference.quote);
  });
}

export function dateAuditStatus(book, chapter, options = {}) {
  validateDateAuditScope(book, chapter);
  const peopleDir = options.peopleDir ?? PEOPLE_DIR;
  const file = path.join(peopleDir, 'date-audits', book, `${chapter}.json`);
  if (!fs.existsSync(file)) return { status: 'un-audited', auditVersion: DATE_AUDIT_VERSION };
  if (!fs.existsSync(path.join(options.dataDir ?? DATA_DIR, book, `${chapter}.json`)) ||
      !fs.existsSync(path.join(peopleDir, 'extractions', book, `${chapter}.json`))) return { status: 'stale', auditVersion: DATE_AUDIT_VERSION };
  const report = readJson(file);
  const packet = buildDateAuditPacket(book, chapter, options);
  if (report.auditVersion !== DATE_AUDIT_VERSION || report.sourceHash !== packet.sourceHash || report.extractionHash !== packet.extractionHash) return { status: 'stale', auditVersion: DATE_AUDIT_VERSION };
  validateDateAuditReport(report, packet);
  if (!dateAuditReferencesCurrent(report, options)) return { status: 'stale', auditVersion: DATE_AUDIT_VERSION };
  return { status: report.status, auditVersion: DATE_AUDIT_VERSION, reviewedAt: report.reviewedAt, findings: report.findings.length };
}

export function recordDateAudit(report, options = {}) {
  const packet = buildDateAuditPacket(report.book, report.chapter, options);
  validateDateAuditReport(report, packet);
  if (!dateAuditReferencesCurrent(report, options)) throw new Error('Date audit reference changed or quotation is unsupported');
  const peopleDir = options.peopleDir ?? PEOPLE_DIR;
  const file = path.join(peopleDir, 'date-audits', report.book, `${report.chapter}.json`);
  if (fs.existsSync(file)) {
    const old = readJson(file);
    writeJsonAtomic(path.join(peopleDir, 'date-audit-history', report.book, report.chapter, `${sha256(JSON.stringify(old)).slice(7)}.json`), old);
  }
  writeJsonAtomic(file, report);
  return dateAuditStatus(report.book, report.chapter, options);
}
