// Mechanical review aid only: candidates are NOT identity decisions.
// Uses immutable staging input blobs and never writes canonical files.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const ref = '189e910903c';
const prefix = 'research/people/checkpoints/hanshu088-retained-recovery-20261020-incomplete';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 50_000_000 });
const read = path => git('show', `${ref}:${path}`);
const parse = path => JSON.parse(read(path));
const oldPath = 'data/people/extractions/hanshu/088.json';
const newPath = `${prefix}/extraction-normalized.json`;
const oldSourcePath = 'data/hanshu/088.json';
const newSourcePath = `${prefix}/source.json`;
const [oldRaw, newRaw, oldSourceRaw, newSourceRaw] = [oldPath, newPath, oldSourcePath, newSourcePath].map(read);
const [oldExtraction, newExtraction, oldSource, newSource] = [oldRaw, newRaw, oldSourceRaw, newSourceRaw].map(JSON.parse);
const digest = raw => createHash('sha256').update(raw).digest('hex');
for (const extraction of [oldExtraction, newExtraction]) {
  if (extraction.schemaVersion !== 2 || extraction.book !== 'hanshu' || extraction.chapter !== '088') throw Error('Unexpected extraction format');
}
const units = source => {
  const map = new Map();
  for (const section of source.content) for (const sentence of section.sentences ?? []) {
    if (map.has(sentence.id)) throw Error(`Duplicate source unit ${sentence.id}`);
    map.set(sentence.id, sentence.zh);
  }
  return map;
};
const oldUnits = units(oldSource);
const newUnits = units(newSource);
const profiles = (extraction, sourceUnits) => {
  const map = new Map(extraction.people.map(([id, preferred, historicity, descriptor, hints, names, roles]) => [id, { id, preferred, historicity, descriptor, hints, names, roles, surfaces: [] }]));
  for (const [person, kind, language, exact, occurrences] of extraction.surfaces) {
    if (!map.has(person)) throw Error(`Surface references missing person ${person}`);
    if (language !== 'zh') continue;
    for (const [unit, indexes] of occurrences) {
      if (!sourceUnits.has(unit) || !sourceUnits.get(unit).includes(exact)) throw Error(`Unlocatable surface ${person} ${unit} ${exact}`);
      map.get(person).surfaces.push({unit, exact, kind, occurrences: indexes});
    }
  }
  return map;
};
const oldPeople = profiles(oldExtraction, oldUnits);
const newPeople = profiles(newExtraction, newUnits);
const resolutionPaths = git('grep', '-l', 'hanshu:088:', ref, '--', 'data/people/resolutions').trim().split('\n').map(line => {
  if (!line.startsWith(`${ref}:`)) throw Error(`Unexpected grep result: ${line}`);
  return line.slice(ref.length + 1);
});
const decisionsByPerson = new Map();
for (const path of resolutionPaths) {
  const doc = parse(path);
  for (let index = 0; index < doc.decisions.length; index++) {
    const decision = doc.decisions[index];
    for (const localPerson of decision.localPeople) {
      if (!localPerson.startsWith('hanshu:088:')) continue;
      const id = localPerson.slice('hanshu:088:'.length);
      if (!oldPeople.has(id)) throw Error(`Resolution already refers to missing old person ${localPerson}`);
      if (!decisionsByPerson.has(id)) decisionsByPerson.set(id, []);
      decisionsByPerson.get(id).push({path, index, decision});
    }
  }
}
const nameZh = profile => new Set([profile.preferred[1], ...profile.names.map(([value]) => value.zh)].filter(value => typeof value === 'string' && value));
const rows = [];
for (const [id, decisions] of [...decisionsByPerson].sort(([a], [b]) => a.localeCompare(b))) {
  const prior = oldPeople.get(id);
  const priorNames = nameZh(prior);
  const candidates = [];
  for (const current of newPeople.values()) {
    const matchingNames = [...nameZh(current)].filter(value => priorNames.has(value)).sort();
    const sharedSurfaces = [];
    for (const oldSurface of prior.surfaces) for (const newSurface of current.surfaces) {
      if (oldSurface.unit !== newSurface.unit || oldSurface.exact !== newSurface.exact) continue;
      const oldText = oldUnits.get(oldSurface.unit);
      const newText = newUnits.get(newSurface.unit);
      sharedSurfaces.push({unit: oldSurface.unit, exact: oldSurface.exact, oldKind: oldSurface.kind, newKind: newSurface.kind, oldOccurrences: oldSurface.occurrences, newOccurrences: newSurface.occurrences, chineseSourceUnchanged: oldText === newText, oldChinese: oldText, ...(oldText !== newText ? {newChinese: newText} : {})});
    }
    if (!matchingNames.length && !sharedSurfaces.length) continue;
    candidates.push({person: current, matchingChineseNameValues: matchingNames, sharedChineseSurfaces: sharedSurfaces});
  }
  candidates.sort((a, b) => b.sharedChineseSurfaces.length - a.sharedChineseSurfaces.length || b.matchingChineseNameValues.length - a.matchingChineseNameValues.length || a.person.id.localeCompare(b.person.id));
  rows.push({oldPerson: prior, priorDecisions: decisions, candidates});
}
const spans = new Map();
for (const person of newPeople.values()) for (const surface of person.surfaces) for (const occurrence of surface.occurrences) {
  const key = JSON.stringify([surface.unit, surface.exact, occurrence]);
  if (!spans.has(key)) spans.set(key, {unit: surface.unit, exact: surface.exact, occurrence, chinese: newUnits.get(surface.unit), people: []});
  const span = spans.get(key);
  if (!span.people.some(item => item.id === person.id)) span.people.push({id: person.id, preferred: person.preferred, kind: surface.kind});
}
const sharedNewOccurrences = [...spans.values()].filter(span => span.people.length > 1);
const summary = {
  oldReferencedPeople: rows.length,
  oldReferencedPeopleWithNoCandidate: rows.filter(row => !row.candidates.length).length,
  oldReferencedPeopleWithOneCandidate: rows.filter(row => row.candidates.length === 1).length,
  oldReferencedPeopleWithMultipleCandidates: rows.filter(row => row.candidates.length > 1).length,
  oldReferencedPeopleWithReusedIdButDifferentPreferredChinese: rows.filter(row => newPeople.has(row.oldPerson.id) && newPeople.get(row.oldPerson.id).preferred[1] !== row.oldPerson.preferred[1]).length,
  newChineseExactOccurrencesLinkedToMultiplePeople: sharedNewOccurrences.length,
};
const dossier = JSON.stringify({
  warning: 'UNREVIEWED SEARCH AID, NOT A MAPPING OR APPROVAL. Name/surface matches include titles and generic single characters, and may refer to homonyms. Reused IDs prove nothing. Review complete source and all cross-chapter evidence independently; absence of a candidate proves nothing. No prior decision is carried forward.',
  ref: git('rev-parse', `${ref}^{commit}`).trim(),
  inputs: [{path: oldPath, sha256: digest(oldRaw)}, {path: newPath, sha256: digest(newRaw)}, {path: oldSourcePath, sha256: digest(oldSourceRaw)}, {path: newSourcePath, sha256: digest(newSourceRaw)}],
  resolutionDocuments: resolutionPaths.length,
  summary,
  sharedNewOccurrences,
  rows,
}, null, 2) + '\n';
if (process.argv.length === 2) process.stdout.write(dossier);
else if (process.argv.length === 4 && process.argv[2] === '--output') writeFileSync(process.argv[3], dossier, {flag: 'wx'});
else throw Error('Usage: node hanshu088-identity-dossier-20261020-incomplete.mjs [--output NEW_PATH]');
