#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { REPO_ROOT } from './lib/people-content.mjs';
import { inspectCombinedBefore, prepareCombinedCuration, verifyCombinedCuration, publishCombinedCuration } from './lib/people-combined-curation.mjs';

const { values: o } = parseArgs({ options: {
  help: { type: 'boolean' }, inspect: { type: 'boolean' }, prepare: { type: 'boolean' },
  publish: { type: 'boolean' }, verify: { type: 'boolean' }, book: { type: 'string' }, chapter: { type: 'string' },
  spec: { type: 'string' }, out: { type: 'string' }, receipt: { type: 'string' }, 'receipt-hash': { type: 'string' },
} });
if (o.help) {
  console.log(`Offline preparation (no queue access):
  node scripts/publish-people-combined-curation.mjs --inspect --book BOOK --chapter NNN
  node scripts/publish-people-combined-curation.mjs --prepare --spec /absolute/spec.json --out /absolute/new-receipt.json
  node scripts/publish-people-combined-curation.mjs --verify --receipt /absolute/receipt.json --receipt-hash sha256:...

Only after separate operator authorization and independent implementation review:
  node scripts/publish-people-combined-curation.mjs --publish --receipt /absolute/receipt.json --receipt-hash sha256:...

Spec fields: book, chapter, materializedDir, reviewDir, before (all inspect pins),
priorClaim (the complete existing shared dateAudits chapter claim), claimHash
(SHA-256 of JSON.stringify(priorClaim)), authorAgentIds (all curation authors).
Inspect pins must be checked against the intended original generation, not used
to bless drift. Preparation requires the original canonical bytes still present.

Materialized input names: data/BOOK/NNN.json, candidate.json,
editorial-decisions.json, validation.json. Independent review names:
identity-review.json, date-report.json, validation.json, input-seal.json.
Full source/identity coverage, independent approvals, exact source/extraction/
editorial hashes, source translation-repair replay and production validation
are mandatory. The report's editorialDecisionHash must bind the single newly
added v3 review component, which must approve every new source repair; it cannot
bind old-only reviews or the whole merged history. Full history bytes remain
pinned separately. Actual run/chunk authors are excluded from all approval roles
even when omitted from the declared authors. Protected seal files must remain
byte-identical. A dependency-only refresh must pin its independent addendum and
original complete review, preserving the exact source and reports. Do not reseal
changed inputs without independent review. This is not a date-only repair.

The content-addressed receipt embeds all before/after files, reports, protected
inputs and local workflow artifacts. Save its printed hash independently.
Only the fixed single-chapter source, extraction, editorial and date report
paths are published. Chinese/metadata edits are unsupported; English edits must
replay accepted editorial repairs. Old reports and claim/state/jobs are retained.
No proposed repairs, arbitrary patches, paid calls, commits or deploys are made.

Publish uses the existing global date-process lock and Git-backed queue lease.
The original claim is not rehashed or marked ready during file publication.
An unfinished local generation with an already-ready date claim is rejected:
the established extraction queue does not reserve ready date claims.
After all four canonical documents match, local completion and an explicit
reviewed-generation transition mark the shared date claim ready. Its original
claim remains in dateAuditHistory. The receipt retains the original local state
and every artifact; existing artifacts stay in place. Extraction-lane state is
not rewritten by this dedicated date-generation transition.

Recovery: rerun the same receipt with the same external hash. A durable receipt
must predate any after bytes. Only exact before/after file states are accepted;
third states, missing retained artifacts, stale references, mismatched receipts,
active executors and foreign hosts fail closed. A hard-crash lease must expire
before resumption. No takeover flag is provided. Correct conflicting ownership
through the established queue workflow after confirming the executor stopped.
Preparation/verification are not publication authorization.`);
} else {
  const modes = ['inspect', 'prepare', 'publish', 'verify'].filter(k => o[k]);
  if (modes.length !== 1) throw new Error('Choose exactly one of --inspect, --prepare, --verify, --publish');
  const read = file => {
    if (!file || !path.isAbsolute(file)) throw new Error('An absolute JSON input path is required');
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  };
  if (o.inspect) {
    if (o.spec || o.out || o.receipt || o['receipt-hash']) throw new Error('Unexpected inspect arguments');
    console.log(JSON.stringify(inspectCombinedBefore({ book: o.book, chapter: o.chapter }), null, 2));
  } else if (o.prepare) {
    if (o.book || o.chapter || o.receipt || o['receipt-hash']) throw new Error('Preparation scope belongs in the spec');
    if (!o.out || !path.isAbsolute(o.out) || path.resolve(o.out).startsWith(`${REPO_ROOT}/`)) throw new Error('Prepare into a new absolute file outside the repository');
    const spec = read(o.spec);
    if (spec.root !== undefined && spec.root !== REPO_ROOT) throw new Error('CLI root overrides are not supported');
    const { receipt, hash } = prepareCombinedCuration({ ...spec, root: REPO_ROOT });
    fs.writeFileSync(o.out, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
    console.log(JSON.stringify({ status: 'prepared-not-published', receipt: o.out, hash }));
  } else {
    if (o.book || o.chapter || o.spec || o.out) throw new Error('Publication scope belongs in the pinned receipt');
    const receipt = read(o.receipt);
    const result = o.publish ? publishCombinedCuration(receipt, o['receipt-hash']) : verifyCombinedCuration(receipt, o['receipt-hash']);
    console.log(JSON.stringify(result, null, 2));
  }
}
