#!/usr/bin/env node

import assert from 'node:assert/strict';
import { onRequestGet, onRequestHead } from '../functions/people/[slug].js';
import { personPageShardName } from '../functions/lib/people-shards.js';
import {
  MAX_PUBLIC_PERSON_ALIASES,
  personAlternateNames,
  personCoherentActivityClaims,
  personLifeSummary,
  personPublicDescription,
  personPublicAliases,
} from './lib/people-presentation.mjs';
import { peopleSiteSelfTest } from './lib/people-site.mjs';

peopleSiteSelfTest();

const aliasFixture = {
  preferredName: { kind: 'personal', en: 'Emperor Gaozu', zh: '高祖', pinyin: 'Gaozu' },
  names: [
    { kind: 'personal', en: 'Emperor Gaozu', zh: '高祖', pinyin: 'Gāozǔ', claimRefs: ['c01'] },
    { kind: 'personal', en: '', zh: '', pinyin: '', claimRefs: ['c02'] },
    { kind: 'title', en: 'the Emperor', zh: '上', pinyin: '', claimRefs: ['c03'] },
    { kind: 'title', en: 'Son of Heaven', zh: '天子', pinyin: 'Tianzi', claimRefs: ['c04'] },
    { kind: 'title', en: 'King of Han', zh: '漢王', pinyin: 'Han Wang', claimRefs: ['c05'] },
    { kind: 'surname', en: 'Liu', zh: '劉', pinyin: 'Liú', claimRefs: ['c06'] },
    { kind: 'personal-name', en: 'Liu Bang', zh: '劉邦', pinyin: 'Liú Bāng', claimRefs: ['c07'] },
    { kind: 'personal-name', en: 'Liu Bang', zh: '劉', pinyin: 'Liu Bang', claimRefs: ['c17'] },
    { kind: 'personal', en: 'Liu Ji', zh: '劉季', pinyin: 'Liú Jì', claimRefs: ['c08'] },
    { kind: 'courtesy', en: 'Ji', zh: '季', pinyin: 'Jì', claimRefs: ['c09'] },
    { kind: 'title', en: 'Gaozu', zh: '高皇帝', pinyin: 'Gao Huangdi', claimRefs: ['c10', 'c11', 'c12'] },
    { kind: 'posthumous-name', en: 'Gao Huangdi', zh: '高皇帝', pinyin: 'Gāo Huángdì', claimRefs: ['c13'] },
    { kind: 'temple-name', en: 'Han Gaozu', zh: '漢高祖', pinyin: 'Hàn Gāozǔ', claimRefs: ['c14'] },
    { kind: 'temple-name', en: 'Taizu', zh: '太祖', pinyin: 'Tàizǔ', claimRefs: ['c15'] },
    { kind: 'temple-name', en: 'Gaodi', zh: '高廟', pinyin: 'Gao miao', claimRefs: ['c18'] },
    { kind: 'alternate-name', en: 'High Ancestor', zh: '高祖', pinyin: '', claimRefs: ['c16'] },
  ],
};
const aliases = personPublicAliases(aliasFixture);
assert.equal(aliases.length, MAX_PUBLIC_PERSON_ALIASES);
assert.deepEqual(aliases.map((name) => [name.kind, name.en, name.zh]), [
  ['personal-name', 'Liu Bang', '劉邦'],
  ['courtesy-name', 'Ji', '季'],
  ['posthumous-name', 'Gao Huangdi', '高皇帝'],
  ['temple-name', 'Taizu', '太祖'],
]);
assert.deepEqual(personAlternateNames(aliasFixture), [
  'Liu Bang (劉邦)',
  'Ji (季)',
  'Gao Huangdi (高皇帝)',
  'Taizu (太祖)',
]);
const emperorAliasFixture = {
  preferredName: { kind: 'posthumous-name', en: 'Emperor Wu of Han', zh: '漢武帝', pinyin: 'Hàn Wǔdì' },
  names: [
    { kind: 'personal-name', en: 'Emperor Wu', zh: '武帝', pinyin: 'Wǔdì', claimRefs: ['c01', 'c02', 'c03'] },
    { kind: 'personal', en: 'Liu Che', zh: '劉徹', pinyin: 'Liú Chè', claimRefs: ['c04'] },
    { kind: 'temple-name', en: 'Shizong', zh: '世宗', pinyin: 'Shìzōng', claimRefs: ['c05'] },
  ],
};
assert.deepEqual(personPublicAliases(emperorAliasFixture).map((name) => name.en), ['Liu Che', 'Shizong']);
assert.throws(
  () => personPublicAliases({ ...aliasFixture, names: [{ kind: 'invented-name-kind', en: 'Example' }] }),
  /Unknown person name kind/u,
);

const chronologyFixture = {
  life: {
    birth: [],
    death: [{ value: { westernYear: { era: 'BC', year: 195, precision: 'year' } } }],
    ageClaims: [],
    attestedActivity: [
      { value: { westernYear: { era: 'BC', year: 209, precision: 'year' } } },
      { value: { westernYear: { era: 'BC', year: 156, precision: 'year' } } },
      { value: { westernYear: { era: 'AD', year: 85, precision: 'year' } } },
      { value: { qualitative: 'late Qin to early Han' } },
    ],
  },
};
assert.deepEqual(
  personCoherentActivityClaims(chronologyFixture),
  [chronologyFixture.life.attestedActivity[0], chronologyFixture.life.attestedActivity[3]],
);
assert.equal(personLifeSummary(chronologyFixture), 'Active by BC 209; died BC 195');
assert.equal(
  personPublicDescription({ description: { en: 'Northern Qi prince and commander -- s0179 wrongly identifies his father' } }),
  'Northern Qi prince and commander',
);

const slug = 'fan-ye-fixture';
const expectedShard = personPageShardName(slug);
const context = {
  params: { slug: `${slug}.html` },
  request: new Request(`https://24histories.com/people/${slug}.html`),
  env: {
    ASSETS: {
      async fetch(request) {
        assert.equal(new URL(request.url).pathname, `/data/people/pages/${expectedShard}.json`);
        assert.equal(request.method, 'GET');
        return Response.json({ v: 1, pages: { [slug]: '<!DOCTYPE html><h1>Fan Ye</h1>' } });
      },
    },
  },
};
const response = await onRequestGet(context);
assert.equal(response.status, 200);
assert.match(await response.text(), /Fan Ye/u);
assert.match(response.headers.get('content-type'), /^text\/html/u);
const head = await onRequestHead(context);
assert.equal(head.status, 200);
assert.equal(await head.text(), '');

const missing = await onRequestGet({
  ...context,
  params: { slug: 'unknown-person.html' },
  env: { ASSETS: { fetch: async () => Response.json({ v: 1, pages: {} }) } },
});
assert.equal(missing.status, 404);
console.log('people edge page tests: ok');
