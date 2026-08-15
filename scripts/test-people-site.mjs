#!/usr/bin/env node

import assert from 'node:assert/strict';
import { onRequestGet, onRequestHead } from '../functions/people/[slug].js';
import { personPageShardName } from '../functions/lib/people-shards.js';
import { peopleSiteSelfTest } from './lib/people-site.mjs';

peopleSiteSelfTest();

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
