#!/usr/bin/env node
// Read-only research tool. A successful check is not review approval.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { TextDecoder } from 'node:util';
import { parseCurationDriftJson } from './lib/people-curation-drift.mjs';
import { buildDriftReviewInventory, verifyDriftReview } from './lib/people-curation-drift-review.mjs';
import { claimContentView } from './lib/people-claim-content-view.mjs';

try {
  const args = process.argv.slice(2);
  const includeClaims = args.at(-1) === '--claim-view';
  if (includeClaims) args.pop();
  if (args.length !== 3 && !(args.length === 7 && args[3] === '--verify' && args[5] === '--provenance')) {
    throw new Error('Usage: node scripts/people-curation-drift-review.mjs RETAINED.json CURRENT.json CANDIDATE.json [--verify REPORT.json --provenance AUTHORS.json] [--claim-view]');
  }
  const snapshots = Object.fromEntries(['retained', 'current', 'candidate'].map((name, index) => [name, fs.readFileSync(args[index])]));
  const inventory = buildDriftReviewInventory(snapshots);
  let claimViews = null;
  if (includeClaims) {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const parsed = Object.fromEntries(Object.entries(snapshots).map(([name, bytes]) => [name, parseCurationDriftJson(decoder.decode(bytes))]));
    claimViews = {
      retainedToCurrent: claimContentView(parsed.retained, parsed.current),
      currentToCandidate: claimContentView(parsed.current, parsed.candidate),
      retainedToCandidate: claimContentView(parsed.retained, parsed.candidate),
    };
  }
  let structuralCheck = null;
  let suppliedFiles = null;
  if (args.length === 7) {
    const provenanceBytes = fs.readFileSync(args[6]);
    const reportBytes = fs.readFileSync(args[4]);
    const hash = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
    const text = new TextDecoder('utf-8', { fatal: true }).decode(provenanceBytes);
    const provenanceAuthors = parseCurationDriftJson(text);
    structuralCheck = verifyDriftReview({ snapshots, provenanceAuthors, reportBytes });
    suppliedFiles = { reportRawSha256: hash(reportBytes), provenanceRawSha256: hash(provenanceBytes) };
  }
  process.stdout.write(`${JSON.stringify({ kind: 'structural-evidence-not-approval', warning: 'No provenance completeness, reviewer independence, factual correctness, approval, or publication established; never use as a publication gate', inventory, claimViews, suppliedFiles, structuralCheck }, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`Curation drift review error: ${error.message}\n`);
  process.exitCode = 1;
}
