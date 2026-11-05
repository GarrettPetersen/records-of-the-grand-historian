#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectLocalDisk } from './check-local-disk.mjs';
import { REPO_ROOT } from './lib/people-content.mjs';
import { peopleDigest } from './lib/people-identity-seal.mjs';
import { memberContract } from './lib/people-identity-dossiers.mjs';
import { localNameKeys } from './lib/people-resolution.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { acquireProcessRunLock } from './lib/process-run-lock.mjs';
import { pinnedIdentityChapterContext, inspectPinnedDossierChanges, pinnedIdentityHostGeneratedDirectory } from './lib/people-pinned-identity-source.mjs';
import { readIdentityDossierRegistry, buildIdentityDossierDelta, writeIdentityDossierDelta } from './lib/people-identity-dossier-delta.mjs';

const need = (ok, message) => { if (!ok) throw new Error(message); };
const hostRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const constraints = person => person.claims.filter(c => ['same-person', 'different-person'].includes(c.predicate));

// This changes indexed evidence, never accepted canonical membership or chapter
// approvals. Only normal source/extraction deltas at an exact Git revision are
// accepted; changed resolution/configuration/construction contracts fail closed.
export async function updateIdentityDossierRegistry({ registry, out, sourceRevision }) {
  need(path.isAbsolute(registry ?? '') && path.isAbsolute(out ?? '') && /^[a-f0-9]{40}$/u.test(sourceRevision ?? ''),
    'Absolute --registry/--out and exact --source-revision required');
  need(!fs.existsSync(out), 'Immutable output generation already exists; preserve and reuse it');
  const guard = () => need(!inspectLocalDisk(hostRoot).errors.length, 'Host resource guard rejected dossier update');
  guard();
  const generated = pinnedIdentityHostGeneratedDirectory();
  const release = acquireProcessRunLock(path.join(generated, 'resolution-run.lock'), { label: 'Incremental canonical dossier update', failIfExists: true });
  let index;
  try {
    index = await readIdentityDossierRegistry(registry, new Map());
    const after = pinnedIdentityChapterContext(REPO_ROOT, sourceRevision);
    const inspected = inspectPinnedDossierChanges(index.provenance, after.snapshot);
    const before = pinnedIdentityChapterContext(REPO_ROOT, inspected.retained.revision);
    const matcher = loadProperNounMatcher(), current = new Map(), changed = [], chapters = [];
    const load = (context, book, chapter) => context.load(book, chapter, { properNounMatcher: matcher, strictAliasDispositions: false });
    for (const [key, scope] of [...inspected.changedChapters].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
      guard();
      const old = load(before, scope.book, scope.chapter), next = load(after, scope.book, scope.chapter);
      need(peopleDigest([...old.localPeople.keys()].sort()) === peopleDigest([...next.localPeople.keys()].sort()),
        `Person inventory changed in ${key}; replay accepted membership before updating its dossiers`);
      const memberChanges = [];
      for (const [id, person] of next.localPeople) {
        const original = old.localPeople.get(id), oldContract = peopleDigest(memberContract(original, localNameKeys(original)));
        need(index.memberVersions.get(id) === oldContract, `Retained dossier member does not match pinned source: ${id}`);
        need(peopleDigest(constraints(person)) === peopleDigest(constraints(original)), `Identity constraints changed: ${id}; replay accepted canonical membership`);
        if (peopleDigest(memberContract(person, localNameKeys(person))) !== oldContract) { changed.push(id); memberChanges.push(id); }
      }
      current.set(key, next); chapters.push({ scope: key, people: next.localPeople.size, changedMembers: memberChanges });
    }
    const changedSet = new Set(changed), affected = [...new Set(changed.map(id => index.localPersonMap.get(id)))], people = new Map();
    for (const id of affected) for (const localId of index.dossiers.get(id).localPeople) {
      const [book, chapter] = localId.split(':'), key = `${book}:${chapter}`;
      if (!current.has(key)) { guard(); current.set(key, load(after, book, chapter)); }
      const person = current.get(key).localPeople.get(localId); need(person, `Missing current accepted member ${localId}`);
      if (!changedSet.has(localId)) need(peopleDigest(memberContract(person, localNameKeys(person))) === index.memberVersions.get(localId),
        `Unaccounted dossier member change ${localId}`);
      people.set(localId, person);
    }
    const delta = buildIdentityDossierDelta(index, people, changed, localNameKeys);
    guard();
    const identityInputs = after.snapshot.legacySeal();
    const provenance = { ...index.provenance, revision: sourceRevision, identityInputs,
      update: { kind: 'native-validated-pinned-source-delta', parentRevision: index.provenance.revision,
        changedData: inspected.changedData, changedMembers: changed, updatedDossiers: delta.dossiers.length,
        materializedPeople: people.size, generatedPairs: 0 } };
    const manifest = writeIdentityDossierDelta(out, registry, index, delta, provenance);
    guard();
    return { manifest, chapters, changedMembers: changed.length, updatedDossiers: delta.dossiers.length,
      materializedPeople: people.size, generatedPairs: 0, membershipChanges: 0, chapterApproved: false, published: false };
  } finally { index?.close(); release(); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), options = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.slice(2), name = key === 'source-revision' ? 'sourceRevision' : key;
    need(args[i]?.startsWith('--') && ['registry', 'out', 'source-revision'].includes(key) && args[i + 1] && !Object.hasOwn(options, name),
      'Usage: --registry ABSOLUTE_BASE --out NEW_ABSOLUTE_GENERATION --source-revision FULL_GIT_SHA');
    options[name] = args[i + 1];
  }
  console.log(JSON.stringify(await updateIdentityDossierRegistry(options), null, 2));
}
