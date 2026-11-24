import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { assertRemotePeopleGeneration, assertSharedPeopleRegistry, assertNoDuplicatePeopleRegistry } from './lib/people-generation-policy.mjs';

test('local and generic CI/self-hosted runners cannot allocate global outputs', () => {
  for (const env of [{}, { CI: 'true' }, { GITHUB_ACTIONS: 'true' },
    { GITHUB_ACTIONS: 'true', RUNNER_ENVIRONMENT: 'self-hosted' }, { CF_PAGES: '1' }]) {
    assert.throws(() => assertRemotePeopleGeneration('catalog', env), /requires GitHub-hosted/);
  }
});
test('supported remote build environments admit normal production generation', () => {
  assertRemotePeopleGeneration('catalog', { GITHUB_ACTIONS: 'true', RUNNER_ENVIRONMENT: 'github-hosted' });
  assertRemotePeopleGeneration('catalog', { CF_PAGES: '1', CF_PAGES_COMMIT_SHA: 'pinned-build' });
});
test('full per-job registry copies are refused even in remote builds', () => {
  const prior = { ...process.env };
  try {
    process.env.GITHUB_ACTIONS = 'true'; process.env.RUNNER_ENVIRONMENT = 'github-hosted';
    for (const dir of ['chapter-owners/job/private-membership-replay/registry', 'date-workflow/job/registry', 'identity-dossiers/job/nested']) {
      assert.throws(() => assertSharedPeopleRegistry('/fixture/data/people/generated/' + dir), /one shared/);
    }
    assertSharedPeopleRegistry('/fixture/data/people/generated/identity-dossiers/source-seal');
    assertSharedPeopleRegistry('/tmp/tiny-library-fixture/registry');
    assert.throws(() => assertSharedPeopleRegistry('/tmp/chapter-job/registry', '/production'), /sole shared/);
  } finally {
    for (const key of Object.keys(process.env)) if (!Object.hasOwn(prior, key)) delete process.env[key];
    Object.assign(process.env, prior);
  }
});
test('actual catalog CLI refuses local corpus loading before allocating outputs', () => {
  const env = { ...process.env }; for (const key of ['CF_PAGES', 'CF_PAGES_BUILD_ID', 'CF_PAGES_COMMIT_SHA', 'GITHUB_ACTIONS', 'RUNNER_ENVIRONMENT']) delete env[key];
  const r = spawnSync(process.execPath, [path.resolve('scripts/compile-people-catalog.mjs')], { env, encoding: 'utf8' });
  assert.notEqual(r.status, 0); assert.match(r.stderr, /requires GitHub-hosted CI or Cloudflare Pages/);
  assert.doesNotMatch(r.stdout, /validated-corpus-index/);
});
test('direct site/copy and make entry points cannot allocate website output locally', () => {
  const env = { ...process.env }; for (const key of ['CF_PAGES', 'CF_PAGES_BUILD_ID', 'CF_PAGES_COMMIT_SHA', 'GITHUB_ACTIONS', 'RUNNER_ENVIRONMENT']) delete env[key];
  for (const script of ['scripts/sync-data-to-public.mjs', 'generate-static-pages.js', 'scripts/generate-people-pages.mjs', 'scripts/people-identity-registry-worker.mjs']) {
    const r = spawnSync(process.execPath, [path.resolve(script)], { env, encoding: 'utf8' });
    assert.notEqual(r.status, 0); assert.match(r.stderr, /requires GitHub-hosted CI or Cloudflare Pages/);
  }
  const r = spawnSync('make', ['update', 'BOOK=jinshu'], { env, encoding: 'utf8' });
  assert.notEqual(r.status, 0); assert.match(r.stderr, /requires GitHub-hosted CI or Cloudflare Pages/);
  assert.doesNotMatch(r.stdout, /Updating citations/);
});
test('identical registry inputs cannot be rebuilt under another generation name', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'people-generation-policy-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'old'));
  fs.writeFileSync(path.join(root, 'old/manifest.json'), JSON.stringify({
    kind: 'canonical-identity-dossier-store', provenance: { identityInputs: 'sealed-inputs', revision: 'original' },
  }));
  assert.throws(() => assertNoDuplicatePeopleRegistry(root, 'sealed-inputs'), /reuse its original provenance/);
  assertNoDuplicatePeopleRegistry(root, 'genuinely-changed-inputs');
  fs.writeFileSync(path.join(root, 'old/manifest.json'), '{broken');
  assert.throws(() => assertNoDuplicatePeopleRegistry(root, 'changed'), /JSON/);
});
