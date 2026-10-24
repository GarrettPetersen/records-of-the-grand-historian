#!/usr/bin/env node
// Research aid only. Groups are NOT mappings, identities, approvals, patches,
// or a substitute for complete positional drift and independent source review.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { TextDecoder } from 'node:util';
import { parseCurationDriftJson } from './lib/people-curation-drift.mjs';

const names = ['retained', 'current', 'candidate'];
const canonical = value => Array.isArray(value) ? value.map(canonical)
  : value !== null && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
const key = value => JSON.stringify(canonical(value));

function checkedClaims(snapshot, label) {
  if (!Array.isArray(snapshot?.claims)) throw new Error(`${label}: claims array required`);
  return snapshot.claims.map((claim, index) => {
    if (!Array.isArray(claim) || claim.length !== 5 ||
        typeof claim[0] !== 'string' || !claim[0] || typeof claim[1] !== 'string' || !claim[1] ||
        !Array.isArray(claim[4]) || !claim[4].every(x => typeof x === 'string' && x)) {
      throw new Error(`${label}: unsupported compact claim at index ${index}`);
    }
    // Exact, ordered evidence; not a historical identifier. Changes to any
    // anchor make a row one-sided and must be reviewed across groups manually.
    return { index, claim, anchor: [claim[0], claim[1], claim[4]] };
  });
}

function scope(snapshot, label) {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot) ||
      !Number.isSafeInteger(snapshot.schemaVersion) || snapshot.schemaVersion <= 0 ||
      typeof snapshot.book !== 'string' || !snapshot.book.trim() || snapshot.book !== snapshot.book.trim() ||
      typeof snapshot.chapter !== 'string' || !snapshot.chapter.trim() || snapshot.chapter !== snapshot.chapter.trim()) {
    throw new Error(`${label}: nonempty book, chapter and positive integer schemaVersion required`);
  }
  return [snapshot.schemaVersion, snapshot.book, snapshot.chapter];
}

export function groupUnmatchedClaims(before, after) {
  if (key(scope(before, 'before')) !== key(scope(after, 'after'))) {
    throw new Error('Snapshot schemaVersion, book and chapter must match exactly');
  }
  const left = checkedClaims(before, 'before'), right = checkedClaims(after, 'after');
  const occurrences = rows => {
    const map = new Map();
    for (const row of rows) {
      const k = key(row.claim);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(row);
    }
    return map;
  };
  const leftValues = occurrences(left), rightValues = occurrences(right);
  const unchanged = [];
  const excludedLeft = new Set(), excludedRight = new Set();
  for (const [k, items] of leftValues) {
    const other = rightValues.get(k) ?? [];
    if (items.length === 1 && other.length === 1) {
      excludedLeft.add(items[0].index); excludedRight.add(other[0].index);
      unchanged.push({ beforeIndex: items[0].index, afterIndex: other[0].index });
    }
  }
  const groups = new Map();
  for (const [side, rows, excluded] of [['before', left, excludedLeft], ['after', right, excludedRight]]) {
    for (const row of rows) {
      if (excluded.has(row.index)) continue;
      const k = key(row.anchor);
      if (!groups.has(k)) groups.set(k, { anchor: row.anchor, before: [], after: [] });
      groups.get(k)[side].push({ index: row.index, claim: row.claim });
    }
  }
  return { unchangedUniqueContent: unchanged, groups: [...groups.values()] };
}

export function buildResearchView(snapshots) {
  if (Object.keys(snapshots).sort().join(',') !== [...names].sort().join(',')) throw new Error('Exactly three snapshots required');
  const parsed = {}, rawSha256 = {};
  for (const name of names) {
    if (!Buffer.isBuffer(snapshots[name])) throw new Error(`${name}: raw Buffer required`);
    rawSha256[name] = `sha256:${createHash('sha256').update(snapshots[name]).digest('hex')}`;
    parsed[name] = parseCurationDriftJson(new TextDecoder('utf-8', { fatal: true }).decode(snapshots[name]));
  }
  return {
    kind: 'incomplete-research-only-not-mappings-or-approval', rawSha256,
    warning: 'Groups only share exact person ID, claim type, and ordered evidence references within matching declared schemaVersion, book and chapter. Matching scope does not prove those chapter-local IDs retain identity. Groups do not establish identity or correspondence; changed anchors are separated and duplicates are retained. Inspect the complete positional inventory and every one-sided and ambiguous group. No source review, provenance, packet fingerprint, approval or publication established.',
    transitions: Object.fromEntries([['retained', 'current'], ['current', 'candidate'], ['retained', 'candidate']]
      .map(([from, to]) => [`${from}To${to[0].toUpperCase()}${to.slice(1)}`, groupUnmatchedClaims(parsed[from], parsed[to])])),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv.length !== 5) throw new Error('Usage: node scripts/people-claim-review-groups-research.mjs RETAINED.json CURRENT.json CANDIDATE.json');
    const snapshots = Object.fromEntries(names.map((name, i) => [name, readFileSync(process.argv[i + 2])]));
    process.stdout.write(`${JSON.stringify(buildResearchView(snapshots), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`Research claim grouping error: ${error.message}\n`);
    process.exitCode = 1;
  }
}
