#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { buildDateAuditPacket } from './lib/people-date-audit.mjs';
import { mutateRemotePeopleWorkLedger, readRemotePeopleWorkLedger, dateExecutorIsBusy } from './lib/people-work-queue.mjs';
import { archiveStaleDateReport, archiveStaleDateWorkflow } from './lib/people-date-stale-reconciliation.mjs';

const { values } = parseArgs({ options: { book: { type: 'string' }, chapter: { type: 'string' }, worker: { type: 'string' }, lane: { type: 'string' }, apply: { type: 'boolean' } } });
if (!/^[a-z0-9_-]+$/u.test(values.book ?? '') || !/^\d{3}$/u.test(values.chapter ?? '') || !values.worker || !values.lane) throw new Error('Use --book BOOK --chapter NNN --worker STABLE_ID --lane LANE [--apply]');
const key = `${values.book}/${values.chapter}`;
const packet = buildDateAuditPacket(values.book, values.chapter);
const snapshot = readRemotePeopleWorkLedger();
const expected = snapshot.dateAudits?.[key];
if (!expected) throw new Error(`No date reservation exists for ${key}`);
if (expected.worker !== values.worker || expected.lane !== values.lane) throw new Error(`Only ${expected.worker}/${expected.lane} may reconcile ${key}`);
if (dateExecutorIsBusy(expected, {})) throw new Error(`A live date executor still owns ${key}`);
if (expected.sourceHash === packet.sourceHash && expected.extractionHash === packet.extractionHash) throw new Error(`${key} is not stale`);
const expectedJson = JSON.stringify(expected);
if (!values.apply) {
  console.log(JSON.stringify({ key, applyRequired: true, current: { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash }, prior: { sourceHash: expected.sourceHash, extractionHash: expected.extractionHash, status: expected.status } }, null, 2));
  process.exit(0);
}
const archived = {
  workflow: archiveStaleDateWorkflow({ book: values.book, chapter: values.chapter, sourceHash: packet.sourceHash, extractionHash: packet.extractionHash }),
  report: archiveStaleDateReport({ book: values.book, chapter: values.chapter }),
};
const result = mutateRemotePeopleWorkLedger((ledger) => {
  const prior = ledger.dateAudits?.[key];
  if (!prior) throw new Error(`No date reservation exists for ${key}`);
  if (JSON.stringify(prior) !== expectedJson) throw new Error(`Date reservation changed during stale reconciliation for ${key}`);
  if (prior.worker !== values.worker || prior.lane !== values.lane) throw new Error(`Only ${prior.worker}/${prior.lane} may reconcile ${key}`);
  if (dateExecutorIsBusy(prior, {})) throw new Error(`A live date executor still owns ${key}`);
  if (prior.sourceHash === packet.sourceHash && prior.extractionHash === packet.extractionHash) throw new Error(`${key} is not stale`);
  ledger.dateAuditHistory ??= {};
  (ledger.dateAuditHistory[key] ??= []).push({ ...prior, reconciledAt: new Date().toISOString(), reconciliation: 'stale-source-or-extraction' });
  ledger.dateAudits[key] = { worker: values.worker, lane: values.lane, sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, jobs: {}, status: 'ready', updatedAt: new Date().toISOString() };
  return { changed: true };
}, { message: `Reconcile stale date workflow ${key}` });
console.log(JSON.stringify({ key, reconciled: true, workflowArchive: archived.workflow?.destination ?? null, reportArchive: archived.report?.destination ?? null, queueCommit: result.commit }, null, 2));
