#!/usr/bin/env node

import assert from 'node:assert/strict';
import {
  buildResolutionCandidates,
  resolvePeopleClusters,
  stableCanonicalPersonId,
} from './lib/people-resolution.mjs';

function person(localId, claims = []) {
  return [localId, { localId, claims }];
}

function resolution(batch, decisions, authority) {
  return {
    schemaVersion: 1,
    batch,
    ...(authority ? { authority } : {}),
    decisions: decisions.map(([decision, localPeople]) => ({
      decision,
      localPeople,
      basis: ['self-test'],
      confidence: 'high',
    })),
  };
}

function candidatePerson(localId, preferredNameSuggestion, nameKind, alias) {
  return [localId, {
    localId,
    preferredNameSuggestion,
    historicity: 'historical',
    descriptorSuggestion: 'Ruler',
    identityHints: {
      nativePlaces: [],
      relatedLocalPeople: [],
      activeDateHints: [],
      polityHints: [],
    },
    mentions: [],
    promptVersion: 7,
    claims: [{
      id: `${localId}:name`,
      predicate: 'name',
      value: { kind: nameKind, en: alias.en, zh: alias.zh },
    }],
  }];
}

{
  const people = new Map([person('a'), person('b'), person('c')]);
  const result = resolvePeopleClusters(people, [
    resolution('model-merge', [['merge', ['a', 'c']]]),
    resolution('legacy-separation', [['keep-separate', ['a', 'b']]]),
    resolution('human-correction', [['merge', ['b', 'c']]], 'curated'),
  ]);
  assert.deepEqual(result.clusters.map((cluster) => cluster.localPeople), [['a', 'b', 'c']]);
  assert.equal(result.keepSeparate.size, 0);
}

{
  const people = new Map([person('a'), person('b')]);
  assert.throws(() => resolvePeopleClusters(people, [
    resolution('model-merge', [['merge', ['a', 'b']]]),
    resolution('model-separation', [['keep-separate', ['a', 'b']]]),
  ]), /explicitly kept separate/u);
}

{
  const people = new Map([person('a'), person('b')]);
  const result = resolvePeopleClusters(people, [
    resolution('deduplicated-separation', [['keep-separate', ['a', 'a', 'b']]], 'curated'),
  ]);
  assert.deepEqual(result.clusters.map((cluster) => cluster.localPeople), [['a'], ['b']]);
  assert.equal(result.keepSeparate.size, 1);
}

{
  const people = new Map([
    candidatePerson(
      'sui-emperor',
      { en: 'Emperor Wen of Sui', zh: '隋文帝' },
      'temple',
      { en: 'Gaozu', zh: '高祖' },
    ),
    candidatePerson(
      'han-emperor',
      { en: 'Emperor Gaozu of Han', zh: '漢高祖' },
      'temple',
      { en: 'Gaozu', zh: '高祖' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 0, 'bare temple-name aliases must not create identity blocks');
}

{
  const people = new Map([
    candidatePerson(
      'general-a',
      { en: 'General A', zh: '甲將軍' },
      'posthumous',
      { en: 'Huai', zh: '懷' },
    ),
    candidatePerson(
      'general-b',
      { en: 'General B', zh: '乙將軍' },
      'posthumous',
      { en: 'Huai', zh: '懷' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 0, 'bare posthumous-name aliases must not create identity blocks');
}

{
  const people = new Map([
    candidatePerson(
      'ritual-emperor-a',
      { en: 'Emperor', zh: '皇帝' },
      'title',
      { en: 'Emperor', zh: '皇帝' },
    ),
    candidatePerson(
      'ritual-emperor-b',
      { en: 'Emperor', zh: '皇帝' },
      'title',
      { en: 'Emperor', zh: '皇帝' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 0, 'bare Chinese ruler titles must not create identity blocks');
}

{
  const people = new Map([
    candidatePerson(
      'crown-prince-a',
      { en: 'Crown Prince', zh: '皇太子' },
      'title',
      { en: 'Crown Prince', zh: '皇太子' },
    ),
    candidatePerson(
      'crown-prince-b',
      { en: 'Crown Prince', zh: '太子' },
      'title',
      { en: 'Crown Prince', zh: '太子' },
    ),
    candidatePerson(
      'imperial-prince-a',
      { en: 'Imperial Prince', zh: '皇子' },
      'title',
      { en: 'Imperial Prince', zh: '皇子' },
    ),
    candidatePerson(
      'imperial-prince-b',
      { en: 'Imperial Prince', zh: '皇子' },
      'title',
      { en: 'Imperial Prince', zh: '皇子' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 0, 'bare compound sovereign titles must not create identity blocks');
}

{
  const people = new Map([
    candidatePerson(
      'scholar-wang',
      { en: 'Wang', zh: '王' },
      'surname',
      { en: 'Wang', zh: '王' },
    ),
    candidatePerson(
      'lady-wang',
      { en: 'Wang', zh: '王氏' },
      'surname',
      { en: 'Wang', zh: '王' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 0, 'surname-only preferred labels must not create identity blocks');
}

{
  const people = new Map([
    candidatePerson(
      'mononym-wang-a',
      { en: 'Wang', zh: '旺' },
      'personal',
      { en: 'Wang', zh: '旺' },
    ),
    candidatePerson(
      'mononym-wang-b',
      { en: 'Wang', zh: '旺' },
      'personal',
      { en: 'Wang', zh: '旺' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 1, 'genuine one-word personal names must remain blocking');
}

{
  const people = new Map([
    person('confucius-a'),
    person('confucius-b'),
    person('laozi-a'),
    person('laozi-b'),
  ]);
  const result = resolvePeopleClusters(people, [
    resolution('model-confucius', [['merge', ['confucius-a', 'confucius-b', 'laozi-b']]]),
    resolution('model-laozi', [['merge', ['laozi-a', 'laozi-b']]]),
    resolution('human-separation', [['keep-separate', ['confucius-a', 'laozi-a']]], 'curated'),
    resolution('human-laozi', [['merge', ['laozi-a', 'laozi-b']]], 'curated'),
  ]);
  assert.deepEqual(result.clusters.map((cluster) => cluster.localPeople), [
    ['confucius-a', 'confucius-b'],
    ['laozi-a', 'laozi-b'],
  ]);
}

{
  const people = new Map([
    person('a', [{
      predicate: 'different-person',
      certainty: 'explicit',
      value: { personId: 'b' },
    }]),
    person('b'),
  ]);
  assert.throws(() => resolvePeopleClusters(people, [
    resolution('model-merge', [['merge', ['a', 'b']]]),
  ]), /explicitly identified as different/u);
}

{
  const people = new Map([
    person('a', [{
      predicate: 'different-person',
      certainty: 'explicit',
      value: { personId: 'd' },
    }]),
    person('b'),
    person('c'),
    person('d'),
  ]);
  assert.throws(() => resolvePeopleClusters(people, [
    resolution('merge-left-component', [['merge', ['a', 'b']]]),
    resolution('merge-right-component', [['merge', ['c', 'd']]]),
    resolution('join-through-nonrepresentatives', [['merge', ['b', 'c']]]),
  ]), /explicitly identified as different/u);
}

{
  const people = new Map([person('a'), person('b'), person('c')]);
  const result = resolvePeopleClusters(people, [
    resolution('curated-family', [['merge', ['a', 'b']]], 'curated'),
    resolution('curated-separation', [['keep-separate', ['a', 'c']]], 'curated'),
    resolution('model-crossing-merge', [['merge', ['b', 'c']]]),
  ]);
  assert.deepEqual(
    result.clusters.map((cluster) => cluster.localPeople).sort((left, right) => left[0].localeCompare(right[0])),
    [['a', 'b'], ['c']],
  );
}

{
  const people = new Map([
    person('a', [{
      predicate: 'different-person',
      certainty: 'explicit',
      value: { personId: 'b' },
    }]),
    person('b'),
  ]);
  assert.throws(() => resolvePeopleClusters(people, [
    resolution('human-correction', [['merge', ['a', 'b']]], 'curated'),
  ]), /explicitly kept separate/u);
}

{
  const people = new Map([person('a'), person('b')]);
  assert.throws(() => resolvePeopleClusters(people, [
    resolution('human-merge', [['merge', ['a', 'b']]], 'curated'),
    resolution('human-separation', [['keep-separate', ['a', 'b']]], 'curated'),
  ]), /explicitly kept separate/u);
}

{
  const people = new Map([person('a'), person('b')]);
  assert.throws(() => resolvePeopleClusters(people, [{
    schemaVersion: 1,
    batch: 'colliding-pin',
    authority: 'curated',
    decisions: [{
      decision: 'merge',
      canonicalPersonId: stableCanonicalPersonId('b'),
      localPeople: ['a'],
      basis: ['self-test'],
      confidence: 'high',
    }],
  }]), /Duplicate canonical person ID/u);
}

console.log('People resolution self-test passed.');
