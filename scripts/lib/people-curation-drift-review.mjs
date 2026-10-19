// EXPERIMENTAL, structural evidence check only. Not a publication gate.
// Neither a passing result nor a verdict establishes truth, provenance
// completeness, reviewer independence, approval, or chapter completion.
// Callers must obtain a complete provenance list independently from trusted
// extraction, chunk, repair, and retained-job records before any integration.
import { createHash } from 'node:crypto';
import { TextDecoder } from 'node:util';
import { computeCurationDrift, parseCurationDriftJson } from './people-curation-drift.mjs';

const generations = ['retained', 'current', 'candidate'];
const transitions = [['retained', 'current'], ['current', 'candidate'], ['retained', 'candidate']];
const digest = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const plainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function keys(value, expected, where) {
  if (!plainObject(value) || Object.keys(value).sort().join('\0') !== [...expected].sort().join('\0')) {
    throw new Error(`${where} has missing or unexpected fields`);
  }
}
function nonblank(value, where) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${where} must be nonempty text`);
}
function identity(value, where) {
  // Deliberately require pre-normalized IDs; alias resolution belongs to the
  // trusted provenance source, not to a reviewer's self-declaration.
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9._:@/-]*$/.test(value)) {
    throw new Error(`${where} must be a normalized stable identity`);
  }
}
function readJsonBytes(bytes, where) {
  if (!Buffer.isBuffer(bytes)) throw new Error(`${where} must be exact raw bytes`);
  return parseCurationDriftJson(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (plainObject(value)) return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));

/** Recompute all input bindings and all pairwise rows from three raw snapshots. */
export function buildDriftReviewInventory(snapshots) {
  keys(snapshots, generations, 'snapshots');
  const parsed = {}, inputs = {};
  for (const generation of generations) {
    parsed[generation] = readJsonBytes(snapshots[generation], generation);
    inputs[generation] = {
      rawSha256: digest(snapshots[generation]),
      semanticSha256: digest(Buffer.from(JSON.stringify(canonical(parsed[generation])), 'utf8')),
    };
  }
  const rows = transitions.flatMap(([from, to]) => computeCurationDrift(parsed[from], parsed[to])
    .map((change, index) => ({ from, to, index, change })));
  return { inputs, rows };
}

/**
 * Structurally validate a report against exact raw inputs and separately
 * supplied author IDs. All provenance lists must be nonempty; these lists do
 * not prove completeness or resolve aliases. Evidence text is not verified.
 * Verdicts are descriptive only and never cause adoption or publication.
 */
export function verifyDriftReview({ snapshots, provenanceAuthors, reportBytes }) {
  keys(provenanceAuthors, generations, 'provenanceAuthors');
  const authors = new Set();
  for (const generation of generations) {
    const list = provenanceAuthors[generation];
    if (!Array.isArray(list) || !list.length) throw new Error(`${generation} provenance authors required`);
    const seen = new Set();
    for (const author of list) {
      identity(author, `${generation} author`);
      if (seen.has(author)) throw new Error(`${generation} duplicate author`);
      seen.add(author); authors.add(author);
    }
  }
  const report = readJsonBytes(reportBytes, 'report');
  keys(report, ['schemaVersion', 'inputs', 'reviewer', 'reviews'], 'report');
  if (report.schemaVersion !== 1) throw new Error('Unsupported report schema');
  identity(report.reviewer, 'reviewer');
  if (authors.has(report.reviewer)) throw new Error('Reviewer overlaps known provenance authors');
  const inventory = buildDriftReviewInventory(snapshots);
  if (!same(report.inputs, inventory.inputs)) throw new Error('Input hashes do not match exact snapshots');
  if (!Array.isArray(report.reviews) || report.reviews.length !== inventory.rows.length) {
    throw new Error('Reviews must cover every drift row exactly once');
  }
  for (let i = 0; i < inventory.rows.length; i++) {
    const review = report.reviews[i];
    keys(review, ['row', 'verdict', 'reasoning', 'evidence'], `review ${i}`);
    if (!same(review.row, inventory.rows[i])) throw new Error(`Review ${i} does not match the recomputed row`);
    if (!['supported', 'unsupported', 'uncertain'].includes(review.verdict)) throw new Error(`Review ${i} has invalid substantive verdict`);
    nonblank(review.reasoning, `review ${i} reasoning`);
    if (!Array.isArray(review.evidence) || !review.evidence.length) throw new Error(`Review ${i} needs evidence`);
    for (const evidence of review.evidence) {
      keys(evidence, ['reference', 'excerpt', 'explanation'], `review ${i} evidence`);
      nonblank(evidence.reference, `review ${i} evidence reference`);
      nonblank(evidence.excerpt, `review ${i} evidence excerpt`);
      nonblank(evidence.explanation, `review ${i} evidence explanation`);
    }
  }
  return { structurallyValid: true, rows: inventory.rows.length, warning: 'No provenance completeness, factual correctness, approval, or publication established' };
}
