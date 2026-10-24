import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { loadPinnedDateResources } from './people-date-resources.mjs';

const hash = data => createHash('sha256').update(data).digest('hex');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'people-date-resource-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'schema'));
  const schema = Buffer.from('{"$id":"fixture"}\n');
  const prompt = Buffer.from('independent review instructions\n');
  fs.writeFileSync(path.join(root, 'schema', 'fixture.schema.json'), schema);
  fs.writeFileSync(path.join(root, 'prompt-people-date-review.txt'), prompt);
  const manifest = Buffer.from(JSON.stringify({ schemaVersion: 1, schemas: [{ name: 'fixture.schema.json', sha256: hash(schema) }], datePromptSha256: hash(prompt) }));
  fs.writeFileSync(path.join(root, 'manifest.json'), manifest);
  const env = { PEOPLE_DATE_RESOURCE_ROOT: root, PEOPLE_DATE_RESOURCE_MANIFEST_SHA256: hash(manifest) };
  return { root, env, schema, prompt };
}
test('default is unchanged and incomplete override fails closed', () => {
  assert.equal(loadPinnedDateResources({}), null);
  assert.throws(() => loadPinnedDateResources({ PEOPLE_DATE_RESOURCE_ROOT: '/absolute' }), /both required/);
  assert.throws(() => loadPinnedDateResources({ PEOPLE_DATE_RESOURCE_MANIFEST_SHA256: 'a'.repeat(64) }), /both required/);
  assert.throws(() => loadPinnedDateResources({ PEOPLE_DATE_RESOURCE_ROOT: 'relative', PEOPLE_DATE_RESOURCE_MANIFEST_SHA256: 'a'.repeat(64) }), /both required/);
});
test('returns verified resource snapshots', t => {
  const f = fixture(t), result = loadPinnedDateResources(f.env);
  assert.deepEqual(result.schemas, [{ name: 'fixture.schema.json', document: { $id: 'fixture' } }]);
  assert.equal(result.prompt, f.prompt.toString());
  fs.writeFileSync(path.join(f.root, 'schema', 'fixture.schema.json'), '{}');
  assert.equal(result.schemas[0].document.$id, 'fixture');
  assert.throws(() => loadPinnedDateResources(f.env), /schema digest mismatch/);
});
test('rejects mixed, missing, extra and modified resources', async t => {
  await t.test('manifest', t => { const f = fixture(t); fs.appendFileSync(path.join(f.root, 'manifest.json'), ' '); assert.throws(() => loadPinnedDateResources(f.env), /manifest digest mismatch/); });
  await t.test('prompt', t => { const f = fixture(t); fs.writeFileSync(path.join(f.root, 'prompt-people-date-review.txt'), 'different'); assert.throws(() => loadPinnedDateResources(f.env), /prompt digest mismatch/); });
  await t.test('missing', t => { const f = fixture(t); fs.unlinkSync(path.join(f.root, 'schema', 'fixture.schema.json')); assert.throws(() => loadPinnedDateResources(f.env), /resource set mismatch/); });
  await t.test('extra', t => { const f = fixture(t); fs.writeFileSync(path.join(f.root, 'schema', 'other.schema.json'), '{}'); assert.throws(() => loadPinnedDateResources(f.env), /resource set mismatch/); });
  await t.test('symlink', t => { const f = fixture(t); const file = path.join(f.root, 'schema', 'fixture.schema.json'); fs.unlinkSync(file); fs.symlinkSync(path.join(f.root, 'prompt-people-date-review.txt'), file); assert.throws(() => loadPinnedDateResources(f.env), /not a regular file/); });
});
