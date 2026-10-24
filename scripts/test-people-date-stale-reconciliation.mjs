import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { archiveStaleDateReport, archiveStaleDateWorkflow } from './lib/people-date-stale-reconciliation.mjs';
import { readJson, writeJsonAtomic } from './lib/people-content.mjs';

function fixture() {
  const peopleDir = fs.mkdtempSync(path.join(os.tmpdir(), 'people-date-stale-'));
  const directory = path.join(peopleDir, 'generated', 'date-workflow', 'fixture', '001');
  writeJsonAtomic(path.join(directory, 'state.json'), { schemaVersion: 1, workflowVersion: 1, sourceHash: 'sha256:old-source', extractionHash: 'sha256:old-extraction', phase: 'repair', jobs: { saved: true } });
  writeJsonAtomic(path.join(directory, 'review-0.json'), { saved: true });
  return { peopleDir, directory };
}

test('stale date reconciliation archives every workflow artifact without deleting it', () => {
  const { peopleDir, directory } = fixture();
  const archived = archiveStaleDateWorkflow({ book: 'fixture', chapter: '001', sourceHash: 'sha256:new-source', extractionHash: 'sha256:new-extraction', peopleDir });
  assert.ok(archived);
  assert.ok(!fs.existsSync(directory));
  assert.deepEqual(readJson(path.join(archived.destination, 'state.json')).jobs, { saved: true });
  assert.deepEqual(readJson(path.join(archived.destination, 'review-0.json')), { saved: true });
});

test('matching workflow inputs are never archived', () => {
  const { peopleDir, directory } = fixture();
  assert.equal(archiveStaleDateWorkflow({ book: 'fixture', chapter: '001', sourceHash: 'sha256:old-source', extractionHash: 'sha256:old-extraction', peopleDir }), null);
  assert.ok(fs.existsSync(directory));
});

test('stale reports are retained in immutable history before removal from the live path', () => {
  const { peopleDir } = fixture();
  const report = { book: 'fixture', chapter: '001', status: 'needs-revision', findings: [] };
  writeJsonAtomic(path.join(peopleDir, 'date-audits', 'fixture', '001.json'), report);
  const archived = archiveStaleDateReport({ book: 'fixture', chapter: '001', peopleDir });
  assert.ok(archived);
  assert.ok(!fs.existsSync(archived.report));
  assert.deepEqual(readJson(archived.destination), report);
});
