import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash, randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { REPO_ROOT, writeTextAtomic } from './people-content.mjs';
import { acquireProcessRunLock } from './process-run-lock.mjs';
import { claimIsActive, dateExecutorIsBusy, mutateRemotePeopleWorkLedger, validatePeopleWorkLedger } from './people-work-queue.mjs';
import { validateDateAuditScope, validateDateAuditReport } from './people-date-audit.mjs';
import { combinedDatePacket, documentHash, requireEqual, validateCombinedReviews } from './people-combined-curation-review.mjs';

const KIND = 'reviewed-combined-source-identity-date-curation';
const ROLES = ['source', 'extraction', 'editorial', 'dateReport'];
const byteHash = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const encode = bytes => ({ sha256: byteHash(bytes), base64: bytes.toString('base64') });
const jsonBytes = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
function bytes(snapshot) {
  if (!snapshot || typeof snapshot.base64 !== 'string') throw new Error('Missing receipt content');
  const result = Buffer.from(snapshot.base64, 'base64');
  requireEqual(result.toString('base64'), snapshot.base64, 'receipt base64');
  requireEqual(byteHash(result), snapshot.sha256, 'receipt content hash');
  return result;
}
const parse = snapshot => JSON.parse(bytes(snapshot).toString('utf8'));
const snapshot = file => encode(fs.readFileSync(file));
const maybeSnapshot = file => fs.existsSync(file) ? snapshot(file) : null;
const keys = (object, expected, label) => requireEqual(Object.keys(object).sort(), [...expected].sort(), label);

function paths(root, book, chapter) {
  validateDateAuditScope(book, chapter);
  if (!path.isAbsolute(root)) throw new Error('Combined curation root must be absolute');
  const people = path.join(root, 'data', 'people');
  const workflow = path.join(people, 'generated', 'date-workflow', book, chapter);
  return {
    source: path.join(root, 'data', book, `${chapter}.json`),
    extraction: path.join(people, 'extractions', book, `${chapter}.json`),
    editorial: path.join(people, 'editorial-decisions', book, `${chapter}.json`),
    dateReport: path.join(people, 'date-audits', book, `${chapter}.json`),
    state: path.join(workflow, 'state.json'), workflow,
    receipts: path.join(people, 'combined-curations', book, chapter),
    dateHistory: path.join(people, 'date-audit-history', book, chapter),
    lock: path.join(people, 'generated', 'date-workflow-run.lock'),
  };
}

// Never follow a symlink in a write destination, including an absent leaf's
// existing parents. Input paths are read-only; they never determine destinations.
function safeDestination(root, file) {
  const relative = path.relative(root, file);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Destination escapes chapter root');
  let current = root;
  for (const part of relative.split(path.sep)) {
    current = path.join(current, part);
    let stat;
    try { stat = fs.lstatSync(current); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (stat?.isSymbolicLink()) throw new Error(`Symlink publication destination: ${current}`);
  }
}

function workflowSnapshot(directory) {
  const rows = [];
  const walk = (dir, prefix = '') => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const name = prefix + entry.name;
      if (entry.isSymbolicLink()) throw new Error('Symlink in retained date workflow');
      if (entry.isDirectory()) walk(path.join(dir, entry.name), `${name}/`);
      else if (entry.isFile()) rows.push({ name, content: snapshot(path.join(dir, entry.name)) });
      else throw new Error('Unsupported date workflow artifact');
    }
  };
  walk(directory);
  return rows;
}
const workflowHash = rows => documentHash(rows.map(r => ({ name: r.name, sha256: r.content.sha256 })));

export function inspectCombinedBefore({ root = REPO_ROOT, book, chapter }) {
  const p = paths(root, book, chapter);
  for (const key of [...ROLES, 'state', 'workflow']) safeDestination(root, p[key]);
  const documents = Object.fromEntries(ROLES.map(role => [role, maybeSnapshot(p[role])]));
  const workflow = workflowSnapshot(p.workflow);
  const packet = combinedDatePacket(book, chapter, parse(documents.source), parse(documents.extraction));
  return { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
    ...Object.fromEntries(ROLES.map(role => [`${role}ByteHash`, documents[role]?.sha256 ?? null])),
    stateByteHash: maybeSnapshot(p.state)?.sha256 ?? null, workflowHash: workflowHash(workflow) };
}

// Preparation is offline and read-only outside scratch storage. The caller must
// supply independent exact-before pins and a previously obtained queue claim.
export function prepareCombinedCuration(spec) {
  const { root = REPO_ROOT, book, chapter, materializedDir, reviewDir, before, priorClaim, authorAgentIds } = spec;
  const p = paths(root, book, chapter);
  requireEqual(inspectCombinedBefore({ root, book, chapter }), before, 'exact-before source/extraction/editorial/workflow pins');
  if (!priorClaim || !spec.claimHash) throw new Error('An exact pinned prior queue claim is required');
  requireEqual(documentHash(priorClaim), spec.claimHash, 'prior queue claim pin');
  const inputPaths = {
    source: path.join(materializedDir, 'data', book, `${chapter}.json`),
    extraction: path.join(materializedDir, 'candidate.json'),
    editorial: path.join(materializedDir, 'editorial-decisions.json'),
    materialization: path.join(materializedDir, 'validation.json'),
    identity: path.join(reviewDir, 'identity-review.json'),
    dateReport: path.join(reviewDir, 'date-report.json'),
    validation: path.join(reviewDir, 'validation.json'),
    seal: path.join(reviewDir, 'input-seal.json'),
  };
  for (const file of Object.values(inputPaths)) {
    if (!path.isAbsolute(file) || Object.values(p).includes(file) || file.startsWith(`${p.workflow}/`)) throw new Error('Review inputs must be separate absolute artifact paths');
  }
  const inputs = Object.fromEntries(Object.entries(inputPaths).map(([role, file]) => [role, { file, content: snapshot(file) }]));
  const seal = parse(inputs.seal.content);
  if (!Array.isArray(seal.protectedFiles) || !seal.protectedFiles.length) throw new Error('Missing protected review inputs');
  const protectedInputs = seal.protectedFiles.map(pin => {
    if (!path.isAbsolute(pin.file)) throw new Error('Protected review input requires an absolute path');
    const content = snapshot(pin.file);
    requireEqual(content.sha256, pin.sha256, `protected input ${pin.file}`);
    requireEqual(bytes(content).length, pin.bytes, `protected input size ${pin.file}`);
    return { file: pin.file, content };
  });
  const receipt = { schemaVersion: 1, kind: KIND, root, book, chapter, beforePins: before,
    priorClaim, claimHash: spec.claimHash, authorAgentIds,
    before: Object.fromEntries(ROLES.map(role => [role, maybeSnapshot(p[role])])),
    workflow: workflowSnapshot(p.workflow), inputs, protectedInputs };
  const hash = documentHash(receipt);
  verifyCombinedCuration(receipt, hash, { root, requireBefore: true });
  return { receipt, hash };
}

function completeState(receipt, hash) {
  const old = parse(receipt.workflow.find(r => r.name === 'state.json').content);
  const identity = parse(receipt.inputs.identity.content);
  return { schemaVersion: old.schemaVersion, workflowVersion: old.workflowVersion,
    sourceHash: identity.sourceHash, extractionHash: identity.extractionHash,
    round: 0, phase: 'complete', jobs: {}, reviewReceipt: { kind: KIND, hash },
    reviewedGenerationTransition: { before: { sourceHash: old.sourceHash, extractionHash: old.extractionHash },
      after: { sourceHash: identity.sourceHash, extractionHash: identity.extractionHash }, historyReceipt: hash } };
}
function completeClaim(receipt, hash) {
  const state = completeState(receipt, hash);
  return { worker: receipt.priorClaim.worker, lane: receipt.priorClaim.lane, status: 'ready',
    sourceHash: state.sourceHash, extractionHash: state.extractionHash, jobs: {},
    reviewReceipt: state.reviewReceipt, reviewedGenerationTransition: state.reviewedGenerationTransition };
}

function canonicalState(receipt, hash, requireBefore) {
  const p = paths(receipt.root, receipt.book, receipt.chapter);
  for (const role of [...ROLES, 'state', 'workflow', 'receipts', 'dateHistory', 'lock']) safeDestination(receipt.root, p[role]);
  for (const role of ROLES) {
    const current = maybeSnapshot(p[role])?.sha256 ?? null;
    const before = receipt.before[role]?.sha256 ?? null;
    const after = receipt.inputs[role].content.sha256;
    if (current !== before && (requireBefore || current !== after)) throw new Error(`Canonical ${role} is neither exact before nor reviewed after`);
  }
  const oldState = receipt.workflow.find(r => r.name === 'state.json').content;
  const currentState = maybeSnapshot(p.state)?.sha256 ?? null;
  const finalState = encode(jsonBytes(completeState(receipt, hash)));
  if (currentState !== oldState.sha256 && (requireBefore || currentState !== finalState.sha256)) throw new Error('Local workflow state drift');
  if (currentState === finalState.sha256) {
    for (const role of ROLES) requireEqual(maybeSnapshot(p[role])?.sha256, receipt.inputs[role].content.sha256, 'complete state requires all canonical after documents');
  }
  const actual = workflowSnapshot(p.workflow).filter(r => r.name !== 'state.json');
  requireEqual(actual, receipt.workflow.filter(r => r.name !== 'state.json'), 'retained local jobs/artifacts drift');
  for (const entry of [...receipt.protectedInputs, ...Object.values(receipt.inputs)]) {
    const role = [...ROLES, 'state'].find(role => p[role] === entry.file);
    // Canonical paths were checked above and are the only allowed exceptions
    // to the original protected seal once a durable receipt exists.
    if (!role) requireEqual(maybeSnapshot(entry.file), entry.content, `protected input drift ${entry.file}`);
  }
}

export function verifyCombinedCuration(receipt, expectedHash, { root = REPO_ROOT, requireBefore = false } = {}) {
  if (!/^sha256:[a-f0-9]{64}$/.test(expectedHash ?? '')) throw new Error('An external exact receipt hash is required');
  requireEqual(documentHash(receipt), expectedHash, 'externally pinned receipt hash');
  requireEqual(receipt.root, root, 'publication root');
  requireEqual([receipt.schemaVersion, receipt.kind], [1, KIND], 'combined receipt protocol');
  keys(receipt, ['schemaVersion', 'kind', 'root', 'book', 'chapter', 'beforePins', 'priorClaim', 'claimHash', 'authorAgentIds', 'before', 'workflow', 'inputs', 'protectedInputs'], 'fixed receipt fields');
  keys(receipt.before, ROLES, 'fixed before document roles');
  keys(receipt.inputs, [...ROLES, 'materialization', 'identity', 'validation', 'seal'], 'fixed reviewed document roles');
  const p = paths(root, receipt.book, receipt.chapter);
  for (const entry of Object.values(receipt.inputs)) {
    if (!path.isAbsolute(entry.file) || Object.values(p).includes(entry.file) || entry.file.startsWith(`${p.workflow}/`)) throw new Error('Review inputs must be separate absolute artifact paths');
  }
  if (new Set(Object.values(receipt.inputs).map(e => e.file)).size !== Object.keys(receipt.inputs).length) throw new Error('Review input roles must not alias');
  const beforeSource = parse(receipt.before.source), beforeExtraction = parse(receipt.before.extraction), beforeEditorial = parse(receipt.before.editorial);
  const oldPacket = combinedDatePacket(receipt.book, receipt.chapter, beforeSource, beforeExtraction);
  requireEqual(documentHash(receipt.priorClaim), receipt.claimHash, 'original queue claim');
  const oldState = receipt.workflow.find(r => r.name === 'state.json');
  if (!oldState || new Set(receipt.workflow.map(r => r.name)).size !== receipt.workflow.length) throw new Error('Missing or duplicate retained workflow state');
  for (const row of receipt.workflow) {
    if (!row.name || row.name.split('/').some(part => part === '..' || part === '.' || !part) || path.isAbsolute(row.name)) throw new Error('Invalid retained artifact path');
    bytes(row.content);
  }
  const state = parse(oldState.content);
  requireEqual([state.schemaVersion, state.workflowVersion], [1, 1], 'retained workflow protocol');
  if (!state.jobs || !['audit', 'repair', 'reaudit', 'publish'].includes(state.phase)) throw new Error('Combined curation needs an unfinished retained generation');
  // Extraction reservation treats ready date claims as unowned, regardless of
  // executor tokens. Do not admit that inconsistent state into this workflow.
  if (!['active', 'research-blocked'].includes(receipt.priorClaim.status)) throw new Error('Unfinished combined curation requires an active or research-blocked date claim, not ready');
  for (const doc of [state, receipt.priorClaim]) requireEqual([doc.sourceHash, doc.extractionHash], [oldPacket.sourceHash, oldPacket.extractionHash], 'old generation source/extraction pins');
  if (receipt.priorClaim.combinedCuration || receipt.priorClaim.reviewReceipt) throw new Error('Cannot supersede an already transitioned claim with this receipt');
  validatePeopleWorkLedger({ schemaVersion: 1, claims: {}, dateAudits: { [`${receipt.book}/${receipt.chapter}`]: receipt.priorClaim } });
  if (receipt.before.dateReport) validateDateAuditReport(parse(receipt.before.dateReport), oldPacket);
  requireEqual(receipt.beforePins, { sourceHash: oldPacket.sourceHash, extractionHash: oldPacket.extractionHash,
    ...Object.fromEntries(ROLES.map(role => [`${role}ByteHash`, receipt.before[role]?.sha256 ?? null])),
    stateByteHash: oldState.content.sha256, workflowHash: workflowHash(receipt.workflow) }, 'before content pins');

  const docs = Object.fromEntries(Object.entries(receipt.inputs).map(([role, entry]) => [role, parse(entry.content)]));
  const seal = docs.seal;
  if (!Array.isArray(seal.protectedFiles) || !seal.protectedFiles.length) throw new Error('Missing protected inputs seal');
  requireEqual(receipt.protectedInputs.map(e => e.file), seal.protectedFiles.map(e => e.file), 'complete protected input inventory');
  if (new Set(receipt.protectedInputs.map(e => e.file)).size !== receipt.protectedInputs.length) throw new Error('Duplicate protected input');
  for (const [i, entry] of receipt.protectedInputs.entries()) {
    requireEqual([entry.content.sha256, bytes(entry.content).length], [seal.protectedFiles[i].sha256, seal.protectedFiles[i].bytes], 'sealed protected bytes');
    if (entry.file === p.state) requireEqual(entry.content, oldState.content, 'sealed original local state');
  }
  for (const role of ['source', 'extraction', 'editorial', 'materialization']) {
    const input = receipt.inputs[role];
    const sealed = receipt.protectedInputs.find(e => e.file === input.file);
    requireEqual(sealed?.content, input.content, `review seal must pin final ${role}`);
  }
  for (const role of ['source', 'extraction', 'editorial']) {
    const sealed = receipt.protectedInputs.find(e => e.file === p[role]);
    requireEqual(sealed?.content, receipt.before[role], `review seal must pin canonical before ${role}`);
  }
  for (const r of [docs.identity, docs.dateReport]) {
    const context = r.reviewContext;
    requireEqual(context?.candidatePath, receipt.inputs.extraction.file, 'reviewed candidate path');
    requireEqual(context?.sourcePath, receipt.inputs.source.file, 'reviewed source path');
    requireEqual(context?.candidateByteHash, receipt.inputs.extraction.content.sha256, 'reviewed candidate bytes');
    requireEqual(context?.sourceByteHash, receipt.inputs.source.content.sha256, 'reviewed source bytes');
  }
  requireEqual(docs.materialization.sourceByteHash, receipt.inputs.source.content.sha256, 'materialized source bytes');
  requireEqual(docs.materialization.extractionByteHash, receipt.inputs.extraction.content.sha256, 'materialized extraction bytes');
  const authors = new Set(receipt.authorAgentIds);
  for (const jobs of [state.jobs, receipt.priorClaim.jobs]) {
    for (const [key, job] of Object.entries(jobs)) if (key.startsWith('repair-') && job.agentId) authors.add(job.agentId);
  }
  const result = validateCombinedReviews({ book: receipt.book, chapter: receipt.chapter,
    source: docs.source, candidate: docs.extraction, editorial: docs.editorial,
    identity: docs.identity, dateReport: docs.dateReport, validation: docs.validation,
    materialization: docs.materialization, seal, beforeSource, beforeExtraction, beforeEditorial,
    authorAgentIds: [...authors] }, { dataDir: path.join(root, 'data') });
  canonicalState(receipt, expectedHash, requireBefore);
  return { status: 'verified', receiptHash: expectedHash, sourceHash: result.packet.sourceHash, extractionHash: result.packet.extractionHash, stats: result.stats };
}

// Existing atomic writer plus fsync of content and directory metadata. A receipt
// is not usable for publication until both the file and its ancestors are durable.
function durableWrite(root, file, content) {
  safeDestination(root, file);
  writeTextAtomic(file, content);
  const fd = fs.openSync(file, 'r');
  try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  for (let dir = path.dirname(file); dir.startsWith(root); dir = path.dirname(dir)) {
    const fd = fs.openSync(dir, 'r');
    try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
    if (dir === root) break;
  }
}

function retainedClaim(claim) {
  const copy = structuredClone(claim);
  for (const key of ['executorToken', 'executorExpiresAt', 'executorHost', 'combinedCuration']) delete copy[key];
  return copy;
}

export function publishCombinedCuration(receipt, expectedHash, options = {}) {
  const root = options.root ?? REPO_ROOT;
  const p = paths(root, receipt.book, receipt.chapter);
  safeDestination(root, p.lock);
  const unlock = acquireProcessRunLock(p.lock, { label: 'People date workflow' });
  const mutateLedger = options.mutateLedger ?? mutateRemotePeopleWorkLedger;
  const token = randomUUID(), key = `${receipt.book}/${receipt.chapter}`;
  const receiptFile = path.join(p.receipts, `${expectedHash?.slice(7)}.json`);
  let leased = false;
  const checkpoint = name => options.checkpoint?.(name);
  try {
    safeDestination(root, receiptFile);
    const exists = fs.existsSync(receiptFile);
    if (exists) requireEqual(JSON.parse(fs.readFileSync(receiptFile, 'utf8')), receipt, 'existing durable receipt');
    verifyCombinedCuration(receipt, expectedHash, { root, requireBefore: !exists });
    const finalClaim = completeClaim(receipt, expectedHash);
    const transaction = fn => mutateLedger(ledger => {
      validatePeopleWorkLedger(ledger);
      if (claimIsActive(ledger.claims[key]) && !['ready', 'complete'].includes(ledger.claims[key].status)) throw new Error('Concurrent extraction owns this chapter');
      const result = fn(ledger);
      validatePeopleWorkLedger(ledger);
      return result;
    }, { message: `Reviewed combined curation ${key}` });
    const reservation = transaction(ledger => {
      const claim = ledger.dateAudits?.[key];
      if (!claim) throw new Error('Missing original shared date claim');
      if (isDeepStrictEqual(claim, finalClaim)) {
        if (!exists) throw new Error('Completed queue claim without durable receipt');
        requireEqual(maybeSnapshot(p.state), encode(jsonBytes(completeState(receipt, expectedHash))), 'completed queue requires completed local state');
        if (!ledger.dateAuditHistory?.[key]?.some(c => isDeepStrictEqual(c, receipt.priorClaim))) throw new Error('Completed queue lost original claim history');
        return 'complete';
      }
      if (dateExecutorIsBusy(claim, { executorToken: token })) throw new Error('Concurrent date executor holds the shared lease');
      if (claim.executorHost && claim.executorHost !== os.hostname()) throw new Error('Foreign host executor must be reconciled before combined publication');
      if (claim.combinedCuration) {
        requireEqual(claim.combinedCuration, { kind: KIND, receiptHash: expectedHash }, 'pending queue receipt');
        requireEqual(retainedClaim(claim), retainedClaim(receipt.priorClaim), 'pending old generation claim drift');
      } else requireEqual(claim, receipt.priorClaim, 'exact-before shared queue claim');
      claim.executorToken = token;
      claim.executorHost = os.hostname();
      claim.executorExpiresAt = new Date(Date.now() + 3600000).toISOString();
      claim.combinedCuration = { kind: KIND, receiptHash: expectedHash };
      return 'leased';
    });
    // A queue-complete replay must never open a new generation or rewrite files.
    if (reservation.result === 'complete') return { status: 'complete', receiptHash: expectedHash };
    requireEqual(reservation.result, 'leased', 'queue reservation result');
    leased = true;
    const assertDurableReceipt = () => {
      safeDestination(root, receiptFile);
      requireEqual(JSON.parse(fs.readFileSync(receiptFile, 'utf8')), receipt, 'durable content receipt');
    };
    const renew = () => {
      assertDurableReceipt();
      return transaction(ledger => {
        const claim = ledger.dateAudits?.[key];
        if (!claim || claim.executorToken !== token || Date.parse(claim.executorExpiresAt) <= Date.now()) throw new Error('Lost combined publication executor lease');
        requireEqual(claim.combinedCuration, { kind: KIND, receiptHash: expectedHash }, 'owned lease receipt');
        requireEqual(retainedClaim(claim), retainedClaim(receipt.priorClaim), 'owned generation drift');
        claim.executorExpiresAt = new Date(Date.now() + 3600000).toISOString();
      });
    };
    checkpoint('lease');
    canonicalState(receipt, expectedHash, !exists);
    if (!exists) durableWrite(root, receiptFile, jsonBytes(receipt));
    // Re-read the durable content before authorizing any canonical write.
    assertDurableReceipt();
    checkpoint('receipt');
    renew();
    if (receipt.before.dateReport) {
      const historyFile = path.join(p.dateHistory, `${documentHash(parse(receipt.before.dateReport)).slice(7)}.json`);
      safeDestination(root, historyFile);
      if (fs.existsSync(historyFile)) requireEqual(parse(snapshot(historyFile)), parse(receipt.before.dateReport), 'old date report history');
      else durableWrite(root, historyFile, bytes(receipt.before.dateReport));
    }
    checkpoint('history');
    for (const role of ROLES) {
      renew();
      canonicalState(receipt, expectedHash, false);
      if (maybeSnapshot(p[role])?.sha256 !== receipt.inputs[role].content.sha256) durableWrite(root, p[role], bytes(receipt.inputs[role].content));
      checkpoint(role);
    }
    // Re-run production and reference gates against exact canonical after bytes
    // before either local or shared state can claim completion.
    renew();
    verifyCombinedCuration(receipt, expectedHash, { root });
    for (const role of ROLES) requireEqual(snapshot(p[role]), receipt.inputs[role].content, `published ${role}`);
    durableWrite(root, p.state, jsonBytes(completeState(receipt, expectedHash)));
    checkpoint('state');
    renew();
    canonicalState(receipt, expectedHash, false);
    transaction(ledger => {
      if (ledger.dateAudits[key]?.executorToken !== token || Date.parse(ledger.dateAudits[key].executorExpiresAt) <= Date.now()) throw new Error('Lost lease at generation transition');
      assertDurableReceipt();
      canonicalState(receipt, expectedHash, false);
      ledger.dateAuditHistory ??= {};
      const history = ledger.dateAuditHistory[key] ??= [];
      if (!history.some(c => isDeepStrictEqual(c, receipt.priorClaim))) history.push(structuredClone(receipt.priorClaim));
      ledger.dateAudits[key] = finalClaim;
    });
    checkpoint('queue');
    return { status: 'complete', receiptHash: expectedHash };
  } finally {
    try {
      if (leased) mutateLedger(ledger => {
        const claim = ledger.dateAudits?.[key];
        if (claim?.executorToken === token) {
          delete claim.executorToken;
          delete claim.executorExpiresAt;
        }
      }, { message: `Release combined curation executor ${key}; preserve reviewed transition` });
    } finally { unlock(); }
  }
}
