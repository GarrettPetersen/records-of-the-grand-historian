#!/usr/bin/env node

import assert from 'node:assert/strict';
import { resolvePeopleClusters } from './lib/people-resolution.mjs';

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

console.log('People resolution self-test passed.');
