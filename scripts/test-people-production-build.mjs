#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadPeopleSiteContext } from './lib/people-site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const build = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).scripts.build;
assert.ok(build.startsWith('node scripts/assert-people-production-build.mjs && '), 'production preview guard must be the first build command');

// Run the actual npm build script in an isolated project with the real guard
// and a sentinel in place of this test. The sentinel stops before generators,
// avoids recursive testing, and needs no platform-specific shell or shim.
const npmCli = process.env.npm_execpath;
assert.ok(npmCli && fs.existsSync(npmCli), 'run this test through npm to provide npm_execpath');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'people-build-guard-test-'));
try {
  const marker = path.join(scratch, 'guard-passed');
  fs.mkdirSync(path.join(scratch, 'scripts'));
  fs.copyFileSync(path.join(root, 'package.json'), path.join(scratch, 'package.json'));
  fs.copyFileSync(path.join(root, 'scripts/assert-people-production-build.mjs'), path.join(scratch, 'scripts/assert-people-production-build.mjs'));
  fs.writeFileSync(path.join(scratch, 'scripts/test-people-production-build.mjs'),
    "import fs from 'node:fs'; fs.writeFileSync(process.env.PEOPLE_TEST_MARKER, 'guard passed'); process.exitCode = 93;\n");
  const env = { ...process.env, PEOPLE_TEST_MARKER: marker };
  const runBuild = environment => spawnSync(process.execPath, [npmCli, 'run', 'build', '--silent'], { cwd: scratch, encoding: 'utf8', env: environment });
  const preview = runBuild({ ...env, PEOPLE_SITE_PREVIEW: '1' });
  assert.ifError(preview.error);
  assert.equal(preview.status, 1, preview.stderr);
  assert.match(preview.stderr, /refuses PEOPLE_SITE_PREVIEW=1/);
  assert.equal(fs.existsSync(marker), false, 'no subsequent build command may run in preview');
  const normalEnv = { ...env }; delete normalEnv.PEOPLE_SITE_PREVIEW;
  const guard = spawnSync(process.execPath, [path.join(root, 'scripts/assert-people-production-build.mjs')], { encoding: 'utf8', env: normalEnv });
  assert.ifError(guard.error);
  assert.equal(guard.status, 0, guard.stderr);
  const normal = runBuild(normalEnv);
  assert.ifError(normal.error);
  assert.equal(normal.status, 93, normal.stderr);
  assert.ok(fs.statSync(marker).size > 0, 'normal production reaches the next build step');
  const zero = spawnSync(process.execPath, [path.join(root, 'scripts/assert-people-production-build.mjs')], { encoding: 'utf8', env: { ...normalEnv, PEOPLE_SITE_PREVIEW: '0' } });
  assert.ifError(zero.error);
  assert.equal(zero.status, 0, zero.stderr);
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}

// Test the actual local-preview context without touching generated files.
// The old, in-memory catalog format is a supported read path; interception is
// limited to its two exact generated paths and restored immediately.
const catalog = { schemaVersion: 1, generatedAt: 'fixture', currentPromptVersion: 7, complete: false,
  stats: { sourceChapters: 2, extractedChapters: 1, missingChapters: 1, dateAuditPendingChapters: 1,
    legacyChapters: 0, legacyLocalPeople: 0, pendingTranslationRepairs: 0, unresolvedCandidateBlocks: 0 },
  missingChapterIds: ['fixture:002'], people: [{ id: 'fixture-person' }], familyEdges: [] };
const index = { schemaVersion: 2, generatedAt: 'fixture', currentPromptVersion: 7, complete: false, chapters: {} };
const files = new Map([[path.join(root, 'data/people/generated/catalog.json'), JSON.stringify(catalog)],
  [path.join(root, 'data/people/generated/site-index.json'), JSON.stringify(index)]]);
const exists = fs.existsSync, read = fs.readFileSync, oldPreview = process.env.PEOPLE_SITE_PREVIEW;
try {
  fs.existsSync = file => files.has(String(file)) || exists(file);
  fs.readFileSync = (file, ...args) => files.has(String(file)) ? files.get(String(file)) : read(file, ...args);
  process.env.PEOPLE_SITE_PREVIEW = '1';
  const preview = loadPeopleSiteContext();
  assert.equal(preview.active, true);
  assert.equal(preview.preview, true);
  delete process.env.PEOPLE_SITE_PREVIEW;
  assert.equal(loadPeopleSiteContext().active, false);
} finally {
  fs.existsSync = exists; fs.readFileSync = read;
  if (oldPreview === undefined) delete process.env.PEOPLE_SITE_PREVIEW;
  else process.env.PEOPLE_SITE_PREVIEW = oldPreview;
}
console.log('people production build preview guard: ok');
