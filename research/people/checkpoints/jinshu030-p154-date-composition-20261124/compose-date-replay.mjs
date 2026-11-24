#!/usr/bin/env node
/**
 * Evidence-only: rebuild pre/post date packets and compose a scoped replay report
 * after p154 removal at staging 8630bbad. Does not write data/people/date-audits.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  buildDateAuditPacket,
  validateDateAuditReport,
  dateAuditReferencesCurrent,
} from '../../../../scripts/lib/people-date-audit.mjs';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const SEALED = '4250c15c07f1416179ea73b9645b87d009cf5a47';
const APPLY = '8630bbad2df1b99862c45ef3dd9afded036ec92e';
const DATE_AUDIT = '2871fd8d343a1fd320f7caeaa428b782e3bcde618543e6265b4e14326d0d2d9a';

function show(commit, file) {
  return execSync(`git show ${commit}:${file}`, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function materialize(commit, root) {
  const src = JSON.parse(show(commit, 'data/jinshu/030.json'));
  const ext = JSON.parse(show(commit, 'data/people/extractions/jinshu/030.json'));
  fs.mkdirSync(path.join(root, 'data/jinshu'), { recursive: true });
  fs.mkdirSync(path.join(root, 'data/people/extractions/jinshu'), { recursive: true });
  fs.writeFileSync(path.join(root, 'data/jinshu/030.json'), JSON.stringify(src));
  fs.writeFileSync(path.join(root, 'data/people/extractions/jinshu/030.json'), JSON.stringify(ext));
  return buildDateAuditPacket('jinshu', '030', {
    dataDir: path.join(root, 'data'),
    peopleDir: path.join(root, 'data/people'),
  });
}

function itemKey(item) {
  return item.id.startsWith('hints-') ? `hints:${item.personId}` : item.claimHash;
}

function digestJson(value) {
  return `sha256:${createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
}

function composeReport(priorReport, oldPacket, newPacket) {
  const removedItemKeys = new Set(
    oldPacket.items.filter((item) => item.personId === 'p154').map((item) => itemKey(item)),
  );
  const removedPersonIds = new Set(['p154']);

  const oldByKey = new Map(oldPacket.items.map((item) => [itemKey(item), item]));
  const newByKey = new Map(newPacket.items.map((item) => [itemKey(item), item]));
  const idRemap = [];

  for (const [key, oldItem] of oldByKey) {
    if (removedItemKeys.has(key)) continue;
    const newItem = newByKey.get(key);
    if (!newItem) throw new Error(`Retained claim missing in new packet: ${key}`);
    if (oldItem.id !== newItem.id) {
      idRemap.push({
        from: oldItem.id,
        to: newItem.id,
        claimHash: oldItem.claimHash ?? null,
        personId: oldItem.personId,
      });
    }
  }
  for (const key of newByKey.keys()) {
    if (!oldByKey.has(key) && !removedItemKeys.has(key)) {
      throw new Error(`Unexplained new date item: ${key}`);
    }
  }

  const oldItemChecks = new Map(priorReport.itemChecks.map((c) => [c.id, c]));
  const itemChecks = [];
  for (const item of newPacket.items) {
    const key = itemKey(item);
    const oldItem = oldByKey.get(key);
    const oldId = oldItem.id;
    const prior = oldItemChecks.get(oldId);
    if (!prior) throw new Error(`Prior item check missing for ${oldId}`);
    itemChecks.push({ ...prior, id: item.id });
  }

  const oldPersonChecks = new Map(priorReport.personChecks.map((c) => [c.id, c]));
  const personChecks = newPacket.people.map((p) => {
    const prior = oldPersonChecks.get(p.id);
    if (!prior) throw new Error(`Prior person check missing for ${p.id}`);
    return { ...prior };
  });

  const removedChecks = [
    ...[...removedPersonIds].map((id) => `personChecks:${id}`),
    ...oldPacket.items
      .filter((item) => item.personId === 'p154')
      .map((item) => `itemChecks:${item.id}`),
  ];

  const report = {
    ...priorReport,
    sourceHash: newPacket.sourceHash,
    extractionHash: newPacket.extractionHash,
    itemChecks,
    personChecks,
    reviewedUnits: [...priorReport.reviewedUnits],
    findings: [...priorReport.findings],
    references: [...priorReport.references],
    composition: {
      kind: 'affected-scope-date-replay',
      priorReportDigest: DATE_AUDIT,
      priorSealedCommit: SEALED,
      applyStagingCommit: APPLY,
      stagingPr: 5479,
      removedChecks,
      idRemap,
      retainedReviewer: priorReport.reviewer,
      preservedProvenance: true,
    },
  };
  validateDateAuditReport(report, newPacket);
  if (!dateAuditReferencesCurrent(report, { dataDir: path.join('/tmp', 'jinshu030-post-compose', 'data') })) {
    throw new Error('Composed report references fail against post-apply source');
  }
  return { report, idRemap, removedChecks };
}

const preRoot = '/tmp/jinshu030-pre-compose';
const postRoot = '/tmp/jinshu030-post-compose';
fs.rmSync(preRoot, { recursive: true, force: true });
fs.rmSync(postRoot, { recursive: true, force: true });

const priorBytes = show(SEALED, 'data/people/date-audits/jinshu/030.json');
const priorReport = JSON.parse(priorBytes);
const priorDigest = `sha256:${createHash('sha256').update(priorBytes).digest('hex')}`;
if (priorDigest !== `sha256:${DATE_AUDIT}`) {
  throw new Error(`Date audit digest pin mismatch: ${priorDigest}`);
}

const prePacket = materialize(SEALED, preRoot);
const postPacket = materialize(APPLY, postRoot);
validateDateAuditReport(priorReport, prePacket);

const { report, idRemap, removedChecks } = composeReport(priorReport, prePacket, postPacket);

const receipt = {
  schemaVersion: 1,
  kind: 'jinshu030-p154-date-composition-replay-receipt',
  verifiedAt: new Date().toISOString(),
  pins: {
    sealedIdentityOverlay: SEALED,
    dateAuditDigest: `sha256:${DATE_AUDIT}`,
    applyStagingCommit: APPLY,
    stagingPr: 5479,
  },
  packets: {
    pre: {
      sourceHash: prePacket.sourceHash,
      extractionHash: prePacket.extractionHash,
      people: prePacket.people.length,
      items: prePacket.items.length,
    },
    post: {
      sourceHash: postPacket.sourceHash,
      extractionHash: postPacket.extractionHash,
      people: postPacket.people.length,
      items: postPacket.items.length,
    },
  },
  chineseUnitsDelta: [],
  englishUnitsChanged: ['s0296'],
  removedChecks,
  idRemapCount: idRemap.length,
  idRemap,
  nativeValidation: 'validateDateAuditReport PASS',
  composedReportDigest: digestJson(report),
};

fs.writeFileSync(path.join(__dir, 'date-packet-pre.json'), JSON.stringify(prePacket, null, 2) + '\n');
fs.writeFileSync(path.join(__dir, 'date-packet-post.json'), JSON.stringify(postPacket, null, 2) + '\n');
fs.writeFileSync(path.join(__dir, 'independent-date-audit-report.json'), JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync(path.join(__dir, 'composition-replay-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ ok: true, idRemap: idRemap.length, removedChecks }, null, 2));