// Research prototype only. This module does not authorize publication.
// Callers must provide trusted provenance and reviewer-verification adapters;
// unverified claims of reviewer identity are not evidence of independence.
import { createHash } from 'node:crypto';

function canonical(value, ancestors = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number' && Number.isFinite(value)) return JSON.stringify(value);
  if (typeof value !== 'object' || value === null) throw new Error('Not a JSON value');
  if (ancestors.has(value)) throw new Error('Cyclic input');
  if (Object.getOwnPropertySymbols(value).length) throw new Error('Symbol property');
  const descriptors = Object.getOwnPropertyDescriptors(value);
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (key === 'length' && Array.isArray(value)) continue;
    if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) throw new Error('Non-JSON property');
  }
  ancestors.add(value);
  let result;
  if (Array.isArray(value)) {
    if (Object.keys(value).length !== value.length || Object.keys(value).some((key, i) => key !== String(i))) throw new Error('Sparse or decorated array');
    result = `[${value.map((item) => canonical(item, ancestors)).join(',')}]`;
  } else if (Object.getPrototypeOf(value) === Object.prototype) {
    result = `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key], ancestors)}`).join(',')}}`;
  } else throw new Error('Not a JSON value');
  ancestors.delete(value);
  return result;
}

export function digest(value) {
  return createHash('sha256').update(canonical(value)).digest('hex');
}

function ptr(part) { return String(part).replaceAll('~', '~0').replaceAll('/', '~1'); }
function isObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function delta(before, after, path, changes) {
  if (canonical(before) === canonical(after)) return;
  if (Array.isArray(before) && Array.isArray(after)) {
    const length = Math.max(before.length, after.length);
    for (let i = 0; i < length; i++) {
      const p = `${path}/${i}`;
      if (i >= before.length) changes.push({ path: p, before: { missing: true }, after: { value: after[i] } });
      else if (i >= after.length) changes.push({ path: p, before: { value: before[i] }, after: { missing: true } });
      else delta(before[i], after[i], p, changes);
    }
    return;
  }
  if (isObject(before) && isObject(after)) {
    for (const key of [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()) {
      const p = `${path}/${ptr(key)}`;
      if (!Object.hasOwn(before, key)) changes.push({ path: p, before: { missing: true }, after: { value: after[key] } });
      else if (!Object.hasOwn(after, key)) changes.push({ path: p, before: { value: before[key] }, after: { missing: true } });
      else delta(before[key], after[key], p, changes);
    }
    return;
  }
  changes.push({ path, before: { value: before }, after: { value: after } });
}

function validateBundle(bundle) {
  if (!isObject(bundle) || Object.keys(bundle).sort().join(',') !== 'context,extraction,packet,source') {
    throw new Error('Expected exact source, packet, extraction, and provenance context bundle');
  }
  for (const key of ['source', 'packet', 'extraction']) {
    if (!isObject(bundle[key])) throw new Error(`Missing ${key}`);
  }
  if (!isObject(bundle.packet.input) || !Array.isArray(bundle.packet.units) ||
      !isObject(bundle.packet.preflight) || !Array.isArray(bundle.packet.preflight.candidates)) {
    throw new Error('Missing packet input, units, or candidates');
  }
  const context = bundle.context;
  if (!isObject(context) || !isObject(context.rawByteHashes) || !isObject(context.dependencies) ||
      !Array.isArray(context.authors) || context.authors.length === 0 ||
      !Array.isArray(context.downstreamReferences) || !isObject(context.editorialHistory) ||
      typeof context.historicalPacketReceipt !== 'string' || !context.historicalPacketReceipt.trim()) {
    throw new Error('Incomplete provenance context');
  }
  for (const key of ['source', 'packet', 'extraction', 'editorialHistory']) {
    if (!/^[a-f0-9]{64}$/.test(context.rawByteHashes[key] ?? '')) throw new Error(`Missing raw-byte hash: ${key}`);
  }
  for (const key of ['scanner', 'glossary', 'code']) {
    if (!/^[a-f0-9]{64}$/.test(context.dependencies[key] ?? '')) throw new Error(`Missing dependency hash: ${key}`);
  }
  canonical(bundle);
}

export function buildReviewDossier(before, after) {
  validateBundle(before);
  validateBundle(after);
  const changes = [];
  delta(before, after, '', changes);
  return { version: 1, beforeHash: digest(before), afterHash: digest(after), changes, changesHash: digest(changes) };
}

// Adapters are supplied by trusted host integration, never by a report file.
// verifyProvenance must establish historical packet/source/extraction origin,
// verify raw bytes and dependency digests, identify all authors, and enumerate
// all current editorial history and downstream references (including an empty
// list). In particular a compact expansion's freshly stamped fingerprint is
// not historical evidence; a missing historical packet must fail verification.
// verifyReviewer must authenticate the report and establish independence from
// ALL extraction and repair authors. Both must return exactly true on success.
export async function verifyReview(before, after, report, { verifyProvenance, verifyReviewer } = {}) {
  if (typeof verifyProvenance !== 'function' || typeof verifyReviewer !== 'function') throw new Error('Trusted verification adapters required');
  const dossier = buildReviewDossier(before, after);
  if (!isObject(report) || report.version !== 1 || report.beforeHash !== dossier.beforeHash ||
      report.afterHash !== dossier.afterHash || report.changesHash !== dossier.changesHash) {
    throw new Error('Review does not match exact state and delta');
  }
  if (typeof report.reviewer !== 'string' || !report.reviewer.trim() || !Array.isArray(report.decisions)) throw new Error('Invalid review');
  const expected = new Map(dossier.changes.map((change) => [change.path, digest(change)]));
  if (report.decisions.length !== expected.size) throw new Error('Incomplete review');
  for (const item of report.decisions) {
    if (!isObject(item) || typeof item.path !== 'string' || !expected.has(item.path) ||
        item.changeHash !== expected.get(item.path) || item.decision !== 'approve' ||
        typeof item.reason !== 'string' || !item.reason.trim()) throw new Error('Invalid or duplicate decision');
    expected.delete(item.path);
  }
  if (expected.size) throw new Error('Incomplete review');
  const reportHash = digest(report);
  const dossierHash = digest(dossier);
  if (await verifyProvenance({ before, after, dossier }) !== true) throw new Error('Historical provenance not verified');
  if (await verifyReviewer({ report, reportHash, dossier }) !== true) throw new Error('Reviewer authentication or independence not verified');
  const finalDossier = buildReviewDossier(before, after);
  if (digest(report) !== reportHash || digest(dossier) !== dossierHash || digest(finalDossier) !== dossierHash) throw new Error('Review inputs changed during verification');
  return dossier;
}
