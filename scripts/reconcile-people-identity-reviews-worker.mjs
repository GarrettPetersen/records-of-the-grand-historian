#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectLocalDisk } from './check-local-disk.mjs';
import { REPO_ROOT } from './lib/people-content.mjs';
import { peopleDigest } from './lib/people-identity-seal.mjs';
import { planChapterIdentityReview } from './lib/people-identity-dossiers.mjs';
import { readIdentityDossierRegistry } from './lib/people-identity-dossier-delta.mjs';
import { pinnedIdentityChapterContext, provePinnedDossierReuse, pinnedIdentityHostGeneratedDirectory } from './lib/people-pinned-identity-source.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { captureIdentityProofComponent, reconcileIdentityProofComposition } from './lib/people-identity-proof-composition.mjs';
import { acquireProcessRunLock } from './lib/process-run-lock.mjs';

const need = (ok, message) => { if (!ok) throw new Error(message); };
const hostRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => JSON.parse(fs.readFileSync(file));

// Mechanical recovery only: no dispatch, canonical write, date approval or
// publication. The full native recording/qualification gates still decide
// whether a complete composed proof may become a chapter certificate.
export async function reconcilePeopleIdentityReviews({ currentPlan, history, registry, sourceRevision, out }) {
  for (const [key,value] of Object.entries({ currentPlan,history,registry,out })) need(path.isAbsolute(value ?? ''), `Absolute --${key} required`);
  need(/^[a-f0-9]{40}$/u.test(sourceRevision ?? '') && !fs.existsSync(out), 'Exact source revision and new immutable output directory required');
  const guard = () => need(!inspectLocalDisk(hostRoot).errors.length, 'Host guard rejected retained proof reconciliation'); guard();
  const generated = pinnedIdentityHostGeneratedDirectory();
  const parent = fs.realpathSync(path.dirname(out)), realGenerated = fs.realpathSync(generated);
  need(path.resolve(out).startsWith(generated + path.sep) && (parent === realGenerated || parent.startsWith(realGenerated + path.sep)),
    'Reconciliation output must be an assigned generated-artifact directory');
  const release = acquireProcessRunLock(path.join(generated,'resolution-run.lock'), { label:'Reconcile retained chapter identity proofs',failIfExists:true });
  let index;
  try {
    const plan = read(currentPlan), entries = read(history), pinned = pinnedIdentityChapterContext(REPO_ROOT,sourceRevision);
    need(Array.isArray(entries) && entries.length, 'Explicit retained capture history required');
    const { book,chapter } = plan.scope;
    const inputs = pinned.inputs(book,chapter,{requireAuditReport:false}); // Recovery only; prepare/record keep the required-date default.
    need(peopleDigest(inputs) === peopleDigest(plan.inputs), 'Current plan does not pin the exact source snapshot');
    index = await readIdentityDossierRegistry(registry,new Map());
    const registryReuse = provePinnedDossierReuse(index.provenance,pinned.snapshot); guard();
    need(peopleDigest(planChapterIdentityReview(index,plan.scope,inputs,plan.limits)) === peopleDigest(plan), 'Current plan differs from the native indexed dossier plan');
    const components = [], parents = new Map(), originalBytes = new Map();
    const bytes = file => { need(path.isAbsolute(file ?? ''),'Absolute original capture path required');
      if (!originalBytes.has(file)) originalBytes.set(file,fs.readFileSync(file)); return originalBytes.get(file); };
    for (const entry of entries) {
      const captured = captureIdentityProofComponent(bytes(entry.packet),bytes(entry.report),bytes(entry.transport),read(entry.job),entry.transportPolicy,entry.aggregateJob ? read(entry.aggregateJob) : null);
      components.push(captured.component); if (captured.sourcePlan.fingerprint !== plan.fingerprint) parents.set(captured.sourcePlan.fingerprint,captured.sourcePlan);
    }
    const matcher = loadProperNounMatcher(), sources = new Map(), scopes = new Set([book + ':' + chapter]);
    for (const component of components) for (const person of component.receipt.sourcePeople) scopes.add(person.localId.split(':').slice(0,2).join(':'));
    for (const key of [...scopes].sort()) { guard(); const [b,c] = key.split(':');
      sources.set(key,pinned.load(b,c,{ properNounMatcher:matcher,strictAliasDispositions:key === book + ':' + chapter })); }
    const sourcePlans = [...parents.values()], view = { localPersonMap:index.localPersonMap,canonicalByKnownId:index.canonicalByKnownId };
    const result = reconcileIdentityProofComposition(view,sources,plan,sourcePlans,components);
    const bundle = { schemaVersion:1,kind:'chapter-identity-review-composition',scope:plan.scope,plan,sourcePlans,components,selections:result.selections };
    const receipt = { schemaVersion:1,kind:'native-retained-identity-reconciliation',at:new Date().toISOString(),sourceRevision,scope:plan.scope,
      inputs,registryReuse,planFingerprint:plan.fingerprint,components:components.length,reviewedCases:result.eligible.size,
      reviewedLocalPeople:plan.cases.filter(c => result.eligible.has(c.id)).reduce((n,c) => n + c.localPeople.length,0),
      remainingCaseIds:result.remainingCaseIds,invalidated:result.invalidated,held:result.held,allCasesCovered:!result.remainingCaseIds.length,
      generatedPairs:0,canonicalWrites:0,dateApproval:false,chapterApproved:false,published:false };
    guard(); fs.mkdirSync(out,{ recursive:false,mode:0o700 });
    fs.writeFileSync(path.join(out,'composition.json'),JSON.stringify(bundle,null,2)+'\n',{ flag:'wx',mode:0o600 });
    fs.writeFileSync(path.join(out,'reconciliation-receipt.json'),JSON.stringify(receipt,null,2)+'\n',{ flag:'wx',mode:0o600 });
    return receipt;
  } finally { index?.close(); release(); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args=process.argv.slice(2), options={};
  for (let i=0;i<args.length;i+=2) {
    const key=args[i]?.slice(2), name=key === 'current-plan' ? 'currentPlan' : key === 'source-revision' ? 'sourceRevision' : key;
    need(args[i]?.startsWith('--') && ['current-plan','history','registry','source-revision','out'].includes(key) && args[i+1] && !Object.hasOwn(options,name),
      'Usage: --current-plan ABSOLUTE_FILE --history ABSOLUTE_FILE --registry ABSOLUTE_DIRECTORY --source-revision FULL_SHA --out NEW_ABSOLUTE_DIRECTORY');
    options[name]=args[i+1];
  }
  console.log(JSON.stringify(await reconcilePeopleIdentityReviews(options),null,2));
}
