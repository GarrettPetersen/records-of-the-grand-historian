import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { inventoryLocalPeopleRegistries, evaluatePeopleRegistryStorage, inspectPeopleRegistryStorage } from './lib/people-storage-policy.mjs';

test('new full registry copies fail admission; retained original fingerprints remain readable', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'people-storage-policy-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const base = path.join(root, 'data/people/generated/chapter-owners/job/registry');
  fs.mkdirSync(base, { recursive: true });
  const manifest = { kind: 'canonical-identity-dossier-store', headers: { file: 'dossiers.jsonl', bytes: 2 }, metadata: { file: 'index.jsonl', bytes: 2 } };
  for (const name of ['dossiers.jsonl', 'index.jsonl']) fs.writeFileSync(path.join(base, name), '{}');
  fs.writeFileSync(path.join(base, 'manifest.json'), JSON.stringify(manifest));
  const actual = inventoryLocalPeopleRegistries(root), policy = { schemaVersion: 1, retainedFullRegistries: actual };
  assert.equal(evaluatePeopleRegistryStorage(actual, policy).errors.length, 0);
  assert.match(evaluatePeopleRegistryStorage(actual, { ...policy, retainedFullRegistries: [] }).errors[0], /Unbudgeted/);
  assert.deepEqual(evaluatePeopleRegistryStorage(actual, { ...policy, retainedFullRegistries: [] }, { allowNewFullRegistries: true }).errors, []);
  fs.writeFileSync(path.join(base, 'manifest.json'), JSON.stringify({ ...manifest, changed: true }));
  assert.match(evaluatePeopleRegistryStorage(inventoryLocalPeopleRegistries(root), policy).errors[0], /immutable registry changed/);
  fs.appendFileSync(path.join(base, 'index.jsonl'), 'truncated');
  assert.throws(() => inventoryLocalPeopleRegistries(root), /registry changed/);
});
test('partial global output from an old or direct library writer stops local admission but is allowed on hosted builders', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'people-aggregate-policy-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'data/people/generated/catalog-shards'), { recursive: true });
  fs.writeFileSync(path.join(root, 'data/people/storage-policy.json'), JSON.stringify({schemaVersion:1,retainedFullRegistries:[]}));
  assert.match(inspectPeopleRegistryStorage(root,{env:{}}).errors[0],/global-derived output is forbidden/);
  assert.deepEqual(inspectPeopleRegistryStorage(root,{env:{GITHUB_ACTIONS:'true',RUNNER_ENVIRONMENT:'github-hosted'}}).errors,[]);
});
test('redirected registry paths fail closed', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'people-storage-policy-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const d = path.join(root, 'data/people/generated/identity-dossiers'); fs.mkdirSync(d, { recursive: true });
  fs.symlinkSync(os.tmpdir(), path.join(d, 'redirect'));
  assert.throws(() => inventoryLocalPeopleRegistries(root), /Redirected/);
});
