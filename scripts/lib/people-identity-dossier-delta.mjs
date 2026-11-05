import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { readIdentityDossierStore } from './people-identity-dossier-store.mjs';
import { buildIdentityDossierIndex } from './people-identity-dossiers.mjs';
import { peopleDigest } from './people-identity-seal.mjs';

const need = (ok, message) => { if (!ok) throw new Error(message); };
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const same = (a, b) => peopleDigest(a) === peopleDigest(b);
const compare = (a, b) => a.localeCompare(b, 'en');
const digest = value => /^sha256:[a-f0-9]{64}$/u.test(value ?? '');
const maxDeltaBytes = 16 * 1024 * 1024;
const mapKinds = ['postings', 'englishUnknownPostings', 'memberVersions'];

function regularBytes(file) {
  const stat = fs.lstatSync(file);
  need(stat.isFile() && !stat.isSymbolicLink(), `Expected regular dossier generation file: ${file}`);
  return fs.readFileSync(file);
}

// Updated people must come from the normal native chapter validator. Membership
// is taken exclusively from the retained accepted registry, never from names.
export function buildIdentityDossierDelta(base, updatedPeople, changedLocalIds, nameKeysForPerson) {
  need(updatedPeople instanceof Map && Array.isArray(changedLocalIds) &&
    new Set(changedLocalIds).size === changedLocalIds.length, 'Unique changed members and validated current people required');
  const ids = [...new Set(changedLocalIds.map(id => {
    const canonical = base.localPersonMap.get(id); need(canonical, `Unknown changed member ${id}`); return canonical;
  }))].sort(compare);
  const people = new Map(), clusters = [];
  const retired = new Map(ids.map(id => [id, []]));
  for (const [known, canonical] of base.canonicalByKnownId) if (known !== canonical && retired.has(canonical)) retired.get(canonical).push(known);
  for (const id of ids) {
    const old = base.dossiers.get(id); need(old, `Missing retained dossier ${id}`);
    for (const localId of old.localPeople) {
      const person = updatedPeople.get(localId);
      need(person?.localId === localId && base.localPersonMap.get(localId) === id, `Current accepted member required: ${localId}`);
      people.set(localId, person);
    }
    clusters.push({ canonicalPersonId: id, localPeople: old.localPeople, retiredIds: retired.get(id) });
  }
  const rebuilt = buildIdentityDossierIndex(people, clusters, nameKeysForPerson);
  const dossiers = [], affected = new Set(ids), keys = new Set();
  for (const id of ids) {
    const before = base.dossiers.get(id), after = rebuilt.dossiers.get(id);
    need(same(before.localPeople, after.localPeople), 'A dossier update cannot change accepted membership');
    if (before.version !== after.version) dossiers.push({ beforeVersion: before.version, dossier: after });
    for (const dossier of [before, after]) for (const name of dossier.names) if (name.blocking) keys.add(name.key);
  }
  const maps = Object.fromEntries(mapKinds.map(kind => [kind, []]));
  for (const key of [...keys].sort(compare)) {
    const fullIds = [...(base.postings.get(key)?.ids ?? []).filter(id => !affected.has(id)), ...(rebuilt.postings.get(key)?.ids ?? [])].sort(compare);
    for (const kind of ['postings', 'englishUnknownPostings']) {
      if (kind === 'englishUnknownPostings' && !base[kind].has(key) && !rebuilt[kind].has(key)) continue;
      const before = base[kind].get(key) ?? null;
      const nextIds = kind === 'postings' ? fullIds : [...(before?.ids ?? []).filter(id => !affected.has(id)), ...(rebuilt[kind].get(key)?.ids ?? [])].sort(compare);
      const after = fullIds.length ? { ids: nextIds, total: nextIds.length, fingerprint: peopleDigest({ key, ids: nextIds }) } : null;
      if (!same(before, after)) maps[kind].push([key, before, after]);
    }
  }
  for (const [id, version] of rebuilt.memberVersions) {
    const before = base.memberVersions.get(id); need(digest(before), `Missing retained member version ${id}`);
    if (before !== version) maps.memberVersions.push([id, before, version]);
  }
  return { schemaVersion: 1, kind: 'canonical-identity-dossier-delta', dossiers, maps,
    generatedPairs: 0, membershipChanges: 0, sourceEditorialApproval: false, chronologyApproval: false, publicationApproval: false };
}

function validateDelta(index, delta) {
  need(delta?.schemaVersion === 1 && delta.kind === 'canonical-identity-dossier-delta' &&
    delta.generatedPairs === 0 && delta.membershipChanges === 0 && Array.isArray(delta.dossiers) &&
    delta.sourceEditorialApproval === false && delta.chronologyApproval === false && delta.publicationApproval === false &&
    delta.maps && same(Object.keys(delta.maps).sort(), [...mapKinds].sort()), 'Malformed or authority-granting dossier delta');
  const replacements = new Map();
  for (const { beforeVersion, dossier } of delta.dossiers) {
    need(dossier && !replacements.has(dossier.id) && digest(dossier.version) && index.dossierVersions.get(dossier.id) === beforeVersion,
      'Duplicate or stale dossier replacement');
    const before = index.dossiers.get(dossier.id);
    need(before && same(before.localPeople, dossier.localPeople) &&
      dossier.localPeople.every(id => index.localPersonMap.get(id) === dossier.id), 'Dossier replacement changed accepted membership');
    replacements.set(dossier.id, dossier);
  }
  // Validate every edit before mutating this reader. A failed generation never
  // leaves a partially applied index in use by preparation or recording.
  for (const kind of mapKinds) {
    need(Array.isArray(delta.maps[kind]), 'Missing delta map edits'); const seen = new Set();
    for (const row of delta.maps[kind]) {
      need(Array.isArray(row) && row.length === 3 && typeof row[0] === 'string' && !seen.has(row[0]), 'Malformed or duplicate delta map edit');
      const [key, before, after] = row; seen.add(key);
      need(same(index[kind].get(key) ?? null, before), `Stale dossier delta map entry ${kind}:${key}`);
      if (kind === 'memberVersions') need(digest(after) && replacements.has(index.localPersonMap.get(key)), 'Member version outside updated dossiers');
      else if (after !== null) need(Array.isArray(after.ids) && after.total === after.ids.length &&
        new Set(after.ids).size === after.ids.length && same(after.ids, [...after.ids].sort(compare)) &&
        after.fingerprint === peopleDigest({ key, ids: after.ids }) && after.ids.every(id => index.dossierVersions.has(id)), 'Malformed dossier posting replacement');
    }
  }
  return replacements;
}

function applyDelta(index, delta) {
  const replacements = validateDelta(index, delta), previous = index.dossiers;
  const close = index.close; let closed = false;
  index.dossiers = { size: previous.size, get(id) {
    need(!closed, 'Dossier reader is closed'); return replacements.get(id) ?? previous.get(id);
  } };
  index.close = () => { if (!closed) { closed = true; replacements.clear(); close(); } };
  for (const [id, dossier] of replacements) index.dossierVersions.set(id, dossier.version);
  for (const kind of mapKinds) for (const [key, , after] of delta.maps[kind]) {
    if (after === null) index[kind].delete(key); else index[kind].set(key, after);
  }
}

export function writeIdentityDossierDelta(directory, baseDirectory, baseIndex, delta, provenance) {
  need(path.isAbsolute(directory) && path.isAbsolute(baseDirectory) && directory !== baseDirectory &&
    /^[a-f0-9]{40}$/u.test(provenance?.revision ?? '') && digest(provenance.identityInputs), 'Absolute generation paths and pinned source provenance required');
  need(!fs.existsSync(directory), 'Immutable dossier generation already exists');
  need(Number.isSafeInteger(baseIndex.generationDepth) && baseIndex.generationDepth >= 1 && baseIndex.generationDepth < 16,
    'Dossier delta ancestry limit reached; compact through a normal validated registry build');
  const payload = Buffer.from(JSON.stringify(delta) + '\n');
  need(payload.length <= maxDeltaBytes, 'Dossier delta exceeds bounded generation size; preserve inputs and reduce the update cohort');
  const parentManifest = regularBytes(path.join(baseDirectory, 'manifest.json'));
  // Validate against the exact before state without modifying either the
  // immutable parent files or the caller's retained parent reader.
  validateDelta(baseIndex, delta);
  fs.mkdirSync(directory, { recursive: false, mode: 0o700 });
  fs.writeFileSync(path.join(directory, 'delta.json'), payload, { flag: 'wx', mode: 0o600 });
  const manifest = { schemaVersion: 1, kind: 'canonical-identity-dossier-delta-store',
    base: { directory: path.relative(directory, baseDirectory), manifestSha256: hash(parentManifest) },
    delta: { file: 'delta.json', bytes: payload.length, sha256: hash(payload) }, dossierCount: baseIndex.dossiers.size,
    provenance, sourceEditorialApproval: false, chronologyApproval: false, publicationApproval: false };
  fs.writeFileSync(path.join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  return manifest;
}

// Existing full generations remain readable with their original byte contract.
// Each delta touches only affected dossiers/postings; no corpus name graph or
// full dossier rewrite is performed. Cycles and excessive ancestry fail loudly.
export async function readIdentityDossierRegistry(directory, localPeople, ancestry = new Set()) {
  const absolute = fs.realpathSync(directory);
  need(ancestry.size < 16 && !ancestry.has(absolute), 'Cyclic or excessive dossier delta ancestry');
  const chain = new Set([...ancestry, absolute]), file = path.join(absolute, 'manifest.json'), bytes = regularBytes(file), manifest = JSON.parse(bytes);
  if (manifest.kind === 'canonical-identity-dossier-store') {
    const index = await readIdentityDossierStore(absolute, localPeople); index.generationDepth = 1; return index;
  }
  need(manifest.schemaVersion === 1 && manifest.kind === 'canonical-identity-dossier-delta-store' &&
    typeof manifest.base?.directory === 'string' && !path.isAbsolute(manifest.base.directory) &&
    /^[a-f0-9]{64}$/u.test(manifest.base.manifestSha256 ?? '') && manifest.delta?.file === 'delta.json' &&
    Number.isSafeInteger(manifest.delta.bytes) && manifest.delta.bytes > 0 && manifest.delta.bytes <= maxDeltaBytes &&
    /^[a-f0-9]{64}$/u.test(manifest.delta.sha256 ?? '') && /^[a-f0-9]{40}$/u.test(manifest.provenance?.revision ?? '') &&
    digest(manifest.provenance.identityInputs) && manifest.sourceEditorialApproval === false &&
    manifest.chronologyApproval === false && manifest.publicationApproval === false, 'Invalid dossier delta manifest');
  const parent = path.resolve(absolute, manifest.base.directory), parentFile = path.join(parent, 'manifest.json');
  need(hash(regularBytes(parentFile)) === manifest.base.manifestSha256, 'Dossier delta parent manifest changed');
  const payload = regularBytes(path.join(absolute, manifest.delta.file));
  need(payload.length === manifest.delta.bytes && hash(payload) === manifest.delta.sha256, 'Dossier delta bytes changed');
  const index = await readIdentityDossierRegistry(parent, localPeople, chain);
  try {
    need(hash(regularBytes(parentFile)) === manifest.base.manifestSha256 && index.dossiers.size === manifest.dossierCount,
      'Dossier delta parent changed during read');
    applyDelta(index, JSON.parse(payload)); index.provenance = manifest.provenance; index.generationDepth += 1; return index;
  } catch (error) { index.close(); throw error; }
}
