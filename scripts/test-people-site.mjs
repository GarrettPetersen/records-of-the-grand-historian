#!/usr/bin/env node

import assert from 'node:assert/strict';
import { onRequestGet, onRequestHead } from '../functions/people/[slug].js';
import {
  personIdSlugSuffix,
  personPageShardName,
  personPageSlugSuffix,
} from '../functions/lib/people-shards.js';
import {
  MAX_PUBLIC_PERSON_ALIASES,
  inferredPersonBirthYear,
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
const duplicateAliasFixture = {
  preferredName: { kind: 'personal', en: 'Chen Ping', zh: '陳平', pinyin: 'Chén Píng' },
  names: [
    { kind: 'personal', en: 'Ping', zh: '平', pinyin: 'Píng', claimRefs: ['c01'] },
    { kind: 'alternate', en: null, zh: '平', pinyin: 'Ping', claimRefs: ['c02'] },
  ],
};
assert.deepEqual(personAlternateNames(duplicateAliasFixture), ['Ping (平)']);
assert.deepEqual(personPublicAliases(duplicateAliasFixture)[0].claimRefs, ['c01', 'c02']);
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
assert.equal(personLifeSummary(chronologyFixture), 'First attested BC 209; died BC 195');

const inferredBirthFixture = {
  life: {
    birth: [],
    death: [{
      value: { dateContext: { westernYear: { era: 'AD', year: 445, precision: 'year' } } },
      evidence: ['fixture:s0001'],
    }],
    ageClaims: [{
      value: { age: 48, reckoning: 'sui', unitText: '時年四十八' },
      evidence: ['fixture:s0001'],
    }],
    attestedActivity: [{
      value: { westernYear: { era: 'AD', year: 420, precision: 'year' } },
      evidence: ['fixture:s0002'],
    }],
  },
};
assert.deepEqual(inferredPersonBirthYear(inferredBirthFixture), { era: 'AD', year: 398, precision: 'circa' });
assert.equal(personLifeSummary(inferredBirthFixture), 'c. AD 398 - AD 445');

const explicitBirthFixture = structuredClone(inferredBirthFixture);
explicitBirthFixture.life.birth.push({
  value: { westernYear: { era: 'AD', year: 399, precision: 'circa' } },
});
assert.equal(personLifeSummary(explicitBirthFixture), 'c. AD 399 - AD 445');

const datedChildhoodFixture = {
  life: {
    birth: [],
    death: [{ value: { westernYear: { era: 'BC', year: 74, precision: 'year' } } }],
    ageClaims: [{
      value: {
        age: 8,
        reckoning: 'sui',
        dateContext: { westernYear: { era: 'BC', year: 87, precision: 'year' } },
      },
    }],
    attestedActivity: [{ value: { westernYear: { era: 'BC', year: 87, precision: 'year' } } }],
  },
};
assert.equal(personLifeSummary(datedChildhoodFixture), 'c. BC 94 - BC 74');

const unrelatedAgeFixture = structuredClone(chronologyFixture);
unrelatedAgeFixture.life.ageClaims.push({
  value: { age: 12, context: 'learned to read' },
  evidence: ['fixture:s0099'],
});
assert.equal(personLifeSummary(unrelatedAgeFixture), 'First attested BC 209; died BC 195');
const legendaryChronologyFixture = {
  life: {
    birth: [],
    death: [],
    ageClaims: [],
    attestedActivity: [{ value: { qualitative: 'legendary antiquity' } }],
  },
};
assert.equal(personLifeSummary(legendaryChronologyFixture), 'Legendary antiquity');
const vagueChronologyFixture = structuredClone(legendaryChronologyFixture);
vagueChronologyFixture.life.attestedActivity = [];
assert.equal(personLifeSummary(vagueChronologyFixture), 'Dates uncertain');
const conflictingChronologyFixture = structuredClone(legendaryChronologyFixture);
conflictingChronologyFixture.life.attestedActivity.push({ value: { qualitative: 'literary antiquity' } });
assert.equal(personLifeSummary(conflictingChronologyFixture), 'Dates uncertain');
const verboseChronologyFixture = structuredClone(legendaryChronologyFixture);
verboseChronologyFixture.life.attestedActivity[0].value.qualitative = 'x'.repeat(81);
assert.equal(personLifeSummary(verboseChronologyFixture), 'Dates uncertain');
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

assert.equal(personIdSlugSuffix('per_DEADBEEF0123456789AB'), 'deadbeef');
assert.equal(personPageSlugSuffix('former-fan-ye-deadbeef.html'), 'deadbeef');
assert.equal(personPageSlugSuffix('former-fan-ye.html'), null);
assert.throws(() => personIdSlugSuffix('not-a-person-id'), /Invalid canonical person ID/u);
const retiredSlug = 'former-fan-ye-deadbeef';
const retiredSuffix = personPageSlugSuffix(retiredSlug);
const canonicalSlug = 'fan-ye-fixture';
const redirectEnv = {
  ASSETS: {
    async fetch(request) {
      const pathname = new URL(request.url).pathname;
      if (pathname === `/data/people/pages/${personPageShardName(retiredSlug)}.json`) {
        return Response.json({ v: 1, pages: {} });
      }
      assert.equal(pathname, `/data/people/redirects/${personPageShardName(retiredSuffix)}.json`);
      return Response.json({ v: 1, redirects: { [retiredSuffix]: canonicalSlug } });
    },
  },
};
const redirected = await onRequestGet({
  params: { slug: `${retiredSlug}.html` },
  request: new Request(`https://24histories.com/people/${retiredSlug}.html`),
  env: redirectEnv,
});
assert.equal(redirected.status, 301);
assert.equal(redirected.headers.get('location'), `https://24histories.com/people/${canonicalSlug}.html`);
const redirectedHead = await onRequestHead({
  params: { slug: `${retiredSlug}.html` },
  request: new Request(`https://24histories.com/people/${retiredSlug}.html`, { method: 'HEAD' }),
  env: redirectEnv,
});
assert.equal(redirectedHead.status, 301);
assert.equal(redirectedHead.headers.get('location'), `https://24histories.com/people/${canonicalSlug}.html`);
assert.equal(await redirectedHead.text(), '');

const missing = await onRequestGet({
  ...context,
  params: { slug: 'unknown-person.html' },
  env: {
    ASSETS: {
      async fetch(request) {
        return new URL(request.url).pathname.includes('/pages/')
          ? Response.json({ v: 1, pages: {} })
          : new Response(null, { status: 404 });
      },
    },
  },
});
assert.equal(missing.status, 404);
console.log('people edge page tests: ok');
