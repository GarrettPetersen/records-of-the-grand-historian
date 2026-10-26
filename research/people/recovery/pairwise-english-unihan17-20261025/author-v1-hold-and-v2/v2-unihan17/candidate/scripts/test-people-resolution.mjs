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
  const people = new Map([person('a'), person('b'), person('c')]);
  const result = resolvePeopleClusters(people, [
    resolution('prior-merge', [['merge', ['a', 'b']]]),
    resolution('reviewed-ambiguity', [['possible-same-as', ['b', 'c']]]),
  ]);
  const merged = result.clusters.find((cluster) => cluster.localPeople.includes('a'));
  const separate = result.clusters.find((cluster) => cluster.localPeople.includes('c'));
  const expected = [merged.canonicalPersonId, separate.canonicalPersonId].sort().join('\u0000');
  assert.deepEqual([...result.possibleSameAs], [expected]);
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
      'temple-name',
      { en: 'Gaozu', zh: '高祖' },
    ),
    candidatePerson(
      'han-emperor',
      { en: 'Emperor Gaozu of Han', zh: '漢高祖' },
      'temple-name',
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
      'posthumous-name',
      { en: 'Huai', zh: '懷' },
    ),
    candidatePerson(
      'general-b',
      { en: 'General B', zh: '乙將軍' },
      'posthumous-name',
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
      'qing-empress-dowager-a',
      { en: 'the Empress Dowager', zh: '皇太后' },
      'title',
      { en: 'Empress Dowager', zh: '皇太后' },
    ),
    candidatePerson(
      'qing-empress-dowager-b',
      { en: 'Empress Dowager', zh: '皇太后' },
      'title',
      { en: 'Empress Dowager', zh: '皇太后' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 0, 'leading articles must not revive generic title blocks');
}

{
  const people = new Map([
    candidatePerson(
      'han-emperor-hui',
      { en: 'Emperor Hui of Han', zh: '惠' },
      'posthumous-name',
      { en: 'Emperor Hui of Han', zh: '惠' },
    ),
    candidatePerson(
      'wei-prince-hui',
      { en: 'Prince Hui of Wei', zh: '惠' },
      'posthumous-name',
      { en: 'Prince Hui of Wei', zh: '惠' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 0, 'preferred posthumous fragments must remain non-blocking');
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
      'lady-wang-a',
      { en: 'Lady Wang', zh: '王氏' },
      'descriptive-kinship',
      { en: 'Lady Wang', zh: '王氏' },
    ),
    candidatePerson(
      'lady-wang-b',
      { en: 'Lady Wang', zh: '王氏' },
      'descriptive-kinship',
      { en: 'Lady Wang', zh: '王氏' },
    ),
    candidatePerson(
      'lady-sima',
      { en: 'Lady Sima', zh: '司馬氏' },
      'descriptive-kinship',
      { en: 'Lady Sima', zh: '司馬氏' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 0, 'generic surname-clan labels must not create identity blocks');
}

{
  const people = new Map([
    candidatePerson(
      'wang-huifeng-a',
      { en: 'Wang Huifeng', zh: '王氏' },
      'personal-name',
      { en: 'Wang Huifeng', zh: '王氏' },
    ),
    candidatePerson(
      'wang-huifeng-b',
      { en: 'Wang Huifeng', zh: '王氏' },
      'personal-name',
      { en: 'Wang Huifeng', zh: '王氏' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 1, 'specific English names must remain blocking');
}

{
  const people = new Map([
    candidatePerson(
      'wang-yan-one',
      { en: 'Wang Yan', zh: '王衍' },
      'personal-name',
      { en: 'Wang Yan', zh: '王衍' },
    ),
    candidatePerson(
      'wang-yan-two',
      { en: 'Wang Yan', zh: '王顗' },
      'personal-name',
      { en: 'Wang Yan', zh: '王顗' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 0, 'conflicting Chinese identity names must partition Romanization collisions');
}

{
  const known = [
    candidatePerson('pairwise-a', { en: 'Wang Yan', zh: '王衍' }, 'personal-name', { en: 'Wang Yan', zh: '王衍' }),
    candidatePerson('pairwise-b', { en: 'Wang Yan', zh: '王儼' }, 'personal-name', { en: 'Wang Yan', zh: '王儼' }),
  ];
  const reviewPairs = (entries) => [...new Set(buildResolutionCandidates(new Map(entries)).blocks.flatMap((block) =>
    block.localPeople.flatMap((left, index) => block.localPeople.slice(index + 1).map((right) =>
      [left, right].sort().join('\u0000')
    ))
  ))].sort();
  assert.deepEqual(reviewPairs(known), [], 'the existing strong disjoint-Chinese pair stays partitioned');

  const preferredOnly = candidatePerson('pairwise-c', { en: 'Wang Yan' }, 'personal-name', {});
  preferredOnly[1].claims = [];
  const chineseOnly = candidatePerson('pairwise-c', { en: 'Wang Yan' }, 'personal-name', { zh: '王玄' });
  const missingChinese = candidatePerson('pairwise-c', { en: 'Wang Yan' }, 'personal-name', { en: 'Wang Yan' });
  for (const unknown of [preferredOnly, chineseOnly, missingChinese]) {
    assert.deepEqual(
      reviewPairs([...known, unknown]),
      ['pairwise-a\u0000pairwise-c', 'pairwise-b\u0000pairwise-c'],
      'an unknown English or Chinese member keeps its comparisons without reactivating a strong disjoint pair',
    );
  }

  const bridge = candidatePerson('pairwise-c', { en: 'Wang Yan', zh: '王衍' }, 'personal-name', { en: 'Wang Yan', zh: '王衍' });
  bridge[1].claims.push({
    id: 'pairwise-c:other-name', predicate: 'name',
    value: { kind: 'personal-name', en: 'Wang Yan', zh: '王儼' },
  });
  assert.deepEqual(
    reviewPairs([...known, bridge]),
    ['pairwise-a\u0000pairwise-c', 'pairwise-b\u0000pairwise-c'],
    'multiple Chinese identity aliases preserve bridge comparisons without inventing transitivity',
  );
}


{
  const people = new Map([
    candidatePerson(
      'wang-yan-full',
      { en: 'Wang Yan', zh: '王衍' },
      'personal-name',
      { en: 'Wang Yan', zh: '王衍' },
    ),
    candidatePerson(
      'wang-yan-unknown',
      { en: 'Wang Yan' },
      'personal-name',
      { en: 'Wang Yan' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 1, 'missing Chinese identity evidence must preserve a review candidate');
}

{
  const people = new Map([
    candidatePerson(
      'courtesy-one',
      { en: 'Master Wende', zh: '文德' },
      'courtesy-name',
      { en: 'Master Wende', zh: '文德' },
    ),
    candidatePerson(
      'courtesy-two',
      { en: 'Master Wende', zh: '文得' },
      'courtesy-name',
      { en: 'Master Wende', zh: '文得' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 1, 'non-identity English name kinds must not be partitioned');
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
    candidatePerson(
      'zhong-a',
      { en: 'Zhao Zhong', zh: '趙仲' },
      'personal-name',
      { en: 'Zhong', zh: '仲' },
    ),
    candidatePerson(
      'zhong-b',
      { en: 'Li Zhong', zh: '李忠' },
      'personal-name',
      { en: 'Zhong', zh: '忠' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(
    result.blocks.length,
    0,
    'one-word English readings with different Chinese counterparts must not create identity blocks',
  );
}

{
  const people = new Map([
    candidatePerson(
      'wife-a',
      { en: 'Wife', zh: '妻子' },
      'kinship-name',
      { en: 'Wife', zh: '妻子' },
    ),
    candidatePerson(
      'wife-b',
      { en: 'Wife', zh: '妻子' },
      'kinship-name',
      { en: 'Wife', zh: '妻子' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 0, 'generic kinship labels must not create identity blocks');
}

{
  const people = new Map([
    candidatePerson(
      'third-son-a',
      { en: 'Third son', zh: '第三子' },
      'kinship-reference',
      { en: 'Third son', zh: '第三子' },
    ),
    candidatePerson(
      'third-son-b',
      { en: 'Third son', zh: '第三子' },
      'kinship-reference',
      { en: 'Third son', zh: '第三子' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 0, 'bare ordinal kinship labels must not create identity blocks');
}

{
  const people = new Map([
    candidatePerson(
      'zhang-wife-a',
      { en: 'Wife of Zhang Wenxu', zh: '張文緒之妻' },
      'descriptive-kinship',
      { en: 'Wife of Zhang Wenxu', zh: '張文緒之妻' },
    ),
    candidatePerson(
      'zhang-wife-b',
      { en: 'Wife of Zhang Wenxu', zh: '張文緒之妻' },
      'descriptive-kinship',
      { en: 'Wife of Zhang Wenxu', zh: '張文緒之妻' },
    ),
  ]);
  const result = buildResolutionCandidates(people);
  assert.equal(result.blocks.length, 1, 'specific kinship identities must remain blocking');
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


{
  const reviewPairs = (entries) => [...new Set(buildResolutionCandidates(new Map(entries)).blocks.flatMap((block) =>
    block.localPeople.flatMap((left, index) => block.localPeople.slice(index + 1).map((right) =>
      [left, right].sort().join('\u0000')
    ))
  ))].sort();
  for (const [en, left, right] of [
    ['Han Shou', '韓壽', '韩寿'],
    ['Lu Ji', '陸機', '陆机'],
    ['Han Shou', '韩壽', '韓寿'],
    ['Han Shou', '韓夀', '韩寿'],
    ['Tai Xin', '臺新', '台新'],
    ['Tai Xin', '颱新', '檯新'],
  ]) {
    const entries = [
      candidatePerson('variant-a', { en, zh: left }, 'personal-name', { en, zh: left }),
      candidatePerson('variant-b', { en, zh: right }, 'personal-name', { en, zh: right }),
    ];
    assert.deepEqual(reviewPairs(entries), ['variant-a\u0000variant-b'],
      `documented Unicode variants must retain the comparison: ${left}/${right}`);
    const resolved = resolvePeopleClusters(new Map(entries), []);
    assert.equal(resolved.clusters.length, 2, 'variant equivalence must never itself merge people');
  }
  const unrelated = [
    candidatePerson('variant-a', { en: 'Wang Yan', zh: '王衍' }, 'personal-name', { en: 'Wang Yan', zh: '王衍' }),
    candidatePerson('variant-b', { en: 'Wang Yan', zh: '王儼' }, 'personal-name', { en: 'Wang Yan', zh: '王儼' }),
  ];
  assert.deepEqual(reviewPairs(unrelated), [], 'distinct same-script names remain distinguishable');
  const emperors = [
    candidatePerson('variant-a', { en: 'Huang Di', zh: '黃帝' }, 'personal-name', { en: 'Huang Di', zh: '黃帝' }),
    candidatePerson('variant-b', { en: 'Huang Di', zh: '炎帝' }, 'personal-name', { en: 'Huang Di', zh: '炎帝' }),
  ];
  assert.deepEqual(reviewPairs(emperors), [], 'specific Chinese identities remain distinct');
  const alternate = candidatePerson('variant-c', { en: 'Han Shou', zh: '韓夀' }, 'personal-name', { en: 'Han Shou', zh: '韓夀' });
  alternate[1].claims.push({ id: 'variant-c:birth', predicate: 'name', value: { kind: 'birth-name', en: 'Han Shou', zh: '王儼' } });
  const aliasEntries = [
    candidatePerson('variant-a', { en: 'Han Shou', zh: '韩寿' }, 'personal-name', { en: 'Han Shou', zh: '韩寿' }),
    candidatePerson('variant-b', { en: 'Han Shou', zh: '王儼' }, 'birth-name', { en: 'Han Shou', zh: '王儼' }),
    alternate,
  ];
  assert.deepEqual(reviewPairs(aliasEntries), ['variant-a\u0000variant-c', 'variant-b\u0000variant-c'],
    'variant classes and multiple birth-name aliases retain bridges without merging disjoint endpoints');
  const keys = buildResolutionCandidates(new Map(aliasEntries)).people['variant-c'].nameKeys;
  assert.ok(keys.some((name) => name.key === 'zh:韓夀'), 'raw normalized Chinese name keys stay intact');
  assert.ok(keys.some((name) => name.key === 'zh:王儼'), 'distinct birth-name evidence stays intact');
}

console.log('People resolution self-test passed.');
