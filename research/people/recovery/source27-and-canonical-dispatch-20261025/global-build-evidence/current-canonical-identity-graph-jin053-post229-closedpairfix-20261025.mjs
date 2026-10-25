import fs from 'node:fs';
import path from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const wallStart = performance.now();
const ROOT = '/Users/garrettpetersen/records-of-the-grand-historian';
const RECOVERY = ROOT + '/data/people/generated/independent-identity-recovery';
const OLD = RECOVERY + '/jinshu053-source106-7b6e4f-20261025';
const R = RECOVERY + '/jinshu053-source106-identity-reconciliation-20261025';
const SOURCE_BASE = 'fc921fcea20e424b4b185a3f29efb5cfa8932646';
const COMPILER_SHA = '1399cc11ecd06173d1697426e5ad7a0b12fca06a29d14585f02ddb697adcd1df';
const LINEAR = R + '/graph-packaging-linear-draft-7b6e4f-20261025/linear-json-shards.mjs';
const LINEAR_SHA = 'febf5b73d45c426b85c1ded14db69e0da69a4c1af1f9255abd902a69ec8f1c08';
const CONFIG_ROOT = '/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const ok = (condition, message) => { if (!condition) throw Error(message); };
const git = args => execFileSync('git', args, {cwd: ROOT, encoding: 'utf8', maxBuffer: 64e6});
const args = process.argv.slice(2);
ok(args.every(a => a === '--run' || a === '--check-only' || /^--ref=[a-f0-9]{40}$/.test(a)), 'Use --ref=FULL_ACTUAL_CODE_CHECKPOINT_SHA [--check-only | --run]');
ok(args.filter(a => a.startsWith('--ref=')).length === 1 && args.filter(a => a === '--run' || a === '--check-only').length <= 1, 'One exact --ref and at most one invocation mode required');
const ref = args.find(a => a.startsWith('--ref=')).slice(6), run = args.includes('--run');
ok(git(['rev-parse', ref + '^{commit}']).trim() === ref, 'Actual commit required');
const out = RECOVERY + '/jinshu053-post229-closedpairfix-' + ref.slice(0, 12) + '-20261025';
execFileSync('npm', ['run', 'people:disk:check'], {cwd: ROOT, stdio: 'inherit'});
ok(process.env.PEOPLE_REPO_ROOT === CONFIG_ROOT, 'Require PEOPLE_REPO_ROOT=' + CONFIG_ROOT);
ok(!fs.existsSync(out), 'Unique output already exists; preserve prior invocation and inspect host ownership');
const actualBuilder = fs.realpathSync(new URL(import.meta.url));
const builderPin = {path: actualBuilder, sha256: sha(fs.readFileSync(actualBuilder))};
const oldGraph = JSON.parse(fs.readFileSync(OLD + '/input-pin-manifest.json'));
const runtime = oldGraph.runtime;
const compiler = git(['show', ref + ':scripts/compile-people-catalog.mjs']);
ok(sha(compiler) === COMPILER_SHA, 'Canonical compiler must equal independently approved V2 candidate');
const start = compiler.indexOf('export function unresolvedCandidateState('), end = compiler.indexOf('export function compilePeopleCatalog(');
ok(start >= 0 && end > start, 'Pure canonical compiler export boundaries missing');
const pureSource = compiler.slice(start, end), pureSha = sha(pureSource);
const dependencyPins = [];
for (const oldPin of oldGraph.dependencyPins) {
  if (oldPin.path === 'scripts/compile-people-catalog.mjs') continue;
  const canonical = git(['show', ref + ':' + oldPin.path]);
  const file = path.join(oldPin.location === 'runtime' ? runtime : CONFIG_ROOT, oldPin.path);
  const bytes = fs.readFileSync(file);
  ok(sha(bytes) === sha(canonical) && sha(bytes) === oldPin.sha256, 'Exact canonical runtime/config drift: ' + oldPin.path);
  dependencyPins.push({path: oldPin.path, sha256: sha(bytes), location: oldPin.location});
}
ok(sha(fs.readFileSync(LINEAR)) === LINEAR_SHA, 'Tested linear serializer drift');
const {linearJsonShards} = await import(LINEAR);
const compilerPin = {path: 'scripts/compile-people-catalog.mjs', sha256: COMPILER_SHA, pureFunctionSourceSha256: pureSha, execution: 'Only the two exact canonical pure exports execute in-memory; old runtime compiler is neither imported nor compared'};
const identityPairKey = (a, b) => [a, b].sort().join('\u0000');
const {unresolvedCandidateState, buildResolutionWorkByChapter} = await import('data:text/javascript;base64,' + Buffer.from('const identityPairKey=(a,b)=>[a,b].sort().join("\\u0000");\n' + pureSource).toString('base64'));
const {resolvePeopleClusters, buildResolutionCandidates, explicitIdentityConstraints} = await import(runtime + '/scripts/lib/people-resolution.mjs');
// Real resolver contracts: LOCAL keepSeparate; CANONICAL possibleSameAs. Alternate merged member is outside the name block.
const fixtureIds = ['fixture:001:p001', 'fixture:002:p001', 'fixture:003:p001', 'fixture:004:p001'];
const fixturePeople = new Map(fixtureIds.map(localId => [localId, {localId, claims: []}]));
const fixtureDocument = (decision, localPeople) => ({schemaVersion: 1, batch: 'fixture-' + decision, authority: 'model', decisions: [{decision, localPeople, basis: ['fixture'], confidence: 'high'}]});
for (const decision of ['keep-separate', 'possible-same-as']) {
  const resolved = resolvePeopleClusters(fixturePeople, [fixtureDocument('merge', fixtureIds.slice(0, 2)), fixtureDocument(decision, fixtureIds.slice(1, 3))]);
  const mapping = new Map(resolved.clusters.flatMap(c => c.localPeople.map(id => [id, c.canonicalPersonId])));
  const state = unresolvedCandidateState({blocks: [{id: 'fixture', localPeople: [fixtureIds[0], fixtureIds[2], fixtureIds[3]]}]}, mapping, resolved.keepSeparate, resolved.possibleSameAs);
  const keys = new Set(state.blocks.flatMap(b => b.reviewPairs.map(p => identityPairKey(...p))));
  const pair = (a, b) => identityPairKey(mapping.get(fixtureIds[a]), mapping.get(fixtureIds[b]));
  ok(!keys.has(pair(0, 2)) && keys.has(pair(0, 3)) && keys.has(pair(2, 3)) && keys.size === 2, 'Alias-outside-block closure/unresolved C fixture failed: ' + decision);
  if (decision === 'keep-separate') ok(resolved.keepSeparate.has(identityPairKey(fixtureIds[1], fixtureIds[2])) && resolved.possibleSameAs.size === 0, 'LOCAL separation representation drift');
  else ok(resolved.possibleSameAs.has(pair(0, 2)) && resolved.keepSeparate.size === 0, 'CANONICAL possible-same-as representation drift');
}
const qualificationPath = R + '/current-053-qualification-input-pins.json';
const qualificationRaw = fs.readFileSync(qualificationPath), qualification = JSON.parse(qualificationRaw);
ok(qualification.inputs.length === 4, 'Four actual053 qualification pins required');
for (const pin of qualification.inputs) {
  const bytes = execFileSync('git', ['show', ref + ':' + pin.path], {cwd: ROOT, maxBuffer: 64e6});
  ok(bytes.length === pin.bytes && sha(bytes) === pin.sha256, '053 qualification drift: ' + pin.path);
}
const extractionPaths = git(['ls-tree', '-r', '--name-only', ref, '--', 'data/people/extractions']).trim().split('\n').filter(p => p.endsWith('.json'));
const resolutionPaths = git(['ls-tree', '-r', '--name-only', ref, '--', 'data/people/resolutions']).trim().split('\n').filter(p => p.endsWith('.json'));
ok(extractionPaths.length === 2050 && resolutionPaths.length === 298, 'Expected exact2050 extraction /298 resolution documents');
const sourceBooks = [...new Set(extractionPaths.map(p => 'data/' + p.split('/').at(-2)))];
ok(git(['diff', '--name-only', SOURCE_BASE, ref, '--', 'data/people/extractions', ...sourceBooks]).trim() === '', 'Source/extraction changed from accepted post229 checkpoint; explicit source reconciliation required');
const originalPath = RECOVERY + '/jinshu053-source106-1b9c1e-20261025/selected-complete-endpoint-clusters.json';
const originalRaw = fs.readFileSync(originalPath);
ok(sha(originalRaw) === '13707d57e4ace2e2d0d248aa113612cc5b6ff0ee42038f97bb8a7fff20c7b534', 'Original1363 graph drift');
const original = JSON.parse(originalRaw);
ok(original.remainingDistinctReviewPairs.length === 1363, 'Original1363 pair count mismatch');
console.log(JSON.stringify({mode: run ? 'HOST explicit global graph invocation' : 'READ ONLY preflight; global graph NOT invoked', canonicalRevision: ref, sourceBase: SOURCE_BASE, compilerPin, builderPin, linearSerializer: {path: LINEAR, sha256: LINEAR_SHA}, dependencies: dependencyPins.length, validatedTypedAliasFixtures: 2, extractionCount: extractionPaths.length, resolutionCount: resolutionPaths.length, output: out, obsoletePendingScopes: 'NONE; all existing decisions loaded from actual canonical documents'}));
if (!run) process.exit(0);
fs.mkdirSync(out, {recursive: false});
fs.writeFileSync(out + '/invocation.json', JSON.stringify({status: 'HOST graph invocation in progress; not approval or CI', pid: process.pid, startedAt: new Date().toISOString(), canonicalRevision: ref, builderPin}, null, 2) + '\n');
const inputPins = [];
function readBatch(paths) {
  const result = spawnSync('git', ['cat-file', '--batch'], {cwd: ROOT, input: paths.map(p => ref + ':' + p + '\n').join(''), maxBuffer: 128e6});
  if (result.error || result.status !== 0) throw result.error ?? Error(result.stderr.toString());
  let offset = 0;
  const docs = new Map();
  for (const file of paths) {
    const e = result.stdout.indexOf(10, offset), header = result.stdout.subarray(offset, e).toString(), n = Number(header.split(' ')[2]);
    ok(e >= offset && header.split(' ')[1] === 'blob' && Number.isInteger(n) && n >= 0 && e + n + 2 <= result.stdout.length, 'Missing/incomplete Git object: ' + file);
    const bytes = result.stdout.subarray(e + 1, e + 1 + n);
    inputPins.push({path: file, bytes: bytes.length, sha256: sha(bytes)}); docs.set(file, JSON.parse(bytes.toString())); offset = e + n + 2;
  }
  ok(offset === result.stdout.length, 'Unconsumed Git batch output'); return docs;
}
const {buildPeopleExtractionPacket} = await import(runtime + '/scripts/build-people-extraction-packet.mjs');
const {validateCompactPeopleExtraction, validatePeopleExtraction} = await import(runtime + '/scripts/validate-people-extraction.mjs');
const {loadProperNounMatcher} = await import(runtime + '/scripts/lib/people-candidates.mjs');
const {getPeopleSchemaValidator} = await import(runtime + '/scripts/lib/people-schema.mjs');
const localPeople = new Map(), normalizedChapterInputs = new Map(), matcher = loadProperNounMatcher(), startedAt = new Date().toISOString();
let checked = 0;
for (let offset = 0; offset < extractionPaths.length; offset += 30) {
  const batch = extractionPaths.slice(offset, offset + 30), sources = batch.map(p => 'data/' + p.split('/').slice(-2).join('/')), docs = readBatch([...batch, ...sources]);
  for (let i = 0; i < batch.length; i++) {
    const raw = docs.get(batch[i]), packet = buildPeopleExtractionPacket(raw.book, raw.chapter, {chapterData: docs.get(sources[i]), chapterFile: path.join(ROOT, sources[i]), properNounMatcher: matcher});
    const result = (raw.schemaVersion === 2 ? validateCompactPeopleExtraction : validatePeopleExtraction)(raw, packet), ex = result.normalized, claims = new Map(), mentions = new Map();
    normalizedChapterInputs.set(ex.book + ':' + ex.chapter, ex.input);
    for (const claim of ex.claims) { if (!claims.has(claim.subject)) claims.set(claim.subject, []); claims.get(claim.subject).push(claim); }
    for (const mention of ex.mentions) { if (!mentions.has(mention.person)) mentions.set(mention.person, []); mentions.get(mention.person).push(mention); }
    for (const person of ex.people) { ok(!localPeople.has(person.localId), 'Duplicate local person: ' + person.localId); localPeople.set(person.localId, {...person, book: ex.book, chapter: ex.chapter, promptVersion: ex.run.promptVersion, claims: claims.get(person.localId) ?? [], mentions: mentions.get(person.localId) ?? []}); }
    checked++;
  }
  if (checked % 300 === 0 || checked === extractionPaths.length) console.log(JSON.stringify({checked, total: extractionPaths.length, people: localPeople.size, heapMiB: Math.round(process.memoryUsage().heapUsed / 1048576)}));
}
const documents = [...readBatch(resolutionPaths).values()], schema = getPeopleSchemaValidator().getSchema('https://24histories.com/schema/people/resolution-v1.json'), batches = new Set();
for (const document of documents) { ok(schema(document), 'Resolution schema failed: ' + document.batch); ok(!batches.has(document.batch), 'Duplicate actual resolution batch: ' + document.batch); batches.add(document.batch); }
const candidate = buildResolutionCandidates(localPeople), resolved = resolvePeopleClusters(localPeople, documents), byLocal = new Map(resolved.clusters.flatMap(c => c.localPeople.map(id => [id, c.canonicalPersonId])));
ok(byLocal.size === localPeople.size, 'Global resolver mapping lost local owners');
const unresolved = unresolvedCandidateState(candidate, byLocal, resolved.keepSeparate, resolved.possibleSameAs), work = buildResolutionWorkByChapter(unresolved.blocks, unresolved.localPeople, byLocal);
const targets = ['jinshu:053'];
const targetCanon = new Set([...localPeople.keys()].filter(id => id.startsWith('jinshu:053:')).map(id => byLocal.get(id)));
const rawPrefixBlocks = unresolved.blocks.filter(b => b.localPeople.some(id => id.startsWith('jinshu:053:')));
// A target person's unresolved alias may live in a block with no raw053 member.
const blocks = unresolved.blocks.filter(b => b.reviewPairs.some(pair => pair.some(id => targetCanon.has(id))));
const visible = new Set(blocks.flatMap(b => b.localPeople)), targetPairs = new Map(), rawPrefixPairs = new Set();
for (const block of rawPrefixBlocks) for (const pair of block.reviewPairs) if (pair.some(id => targetCanon.has(id))) rawPrefixPairs.add(identityPairKey(...pair));
for (const block of blocks) for (const pair of block.reviewPairs) if (pair.some(id => targetCanon.has(id))) targetPairs.set(identityPairKey(...pair), pair);
const endpointCanon = new Set([...targetPairs.values()].flat()), endpointClusters = resolved.clusters.filter(c => endpointCanon.has(c.canonicalPersonId));
const canonicalIds = new Set(resolved.clusters.map(c => c.canonicalPersonId));
function canonicalLocalPairs(pairs) {
  const result = new Set();
  for (const key of pairs) { const ids = key.split('\u0000'); ok(ids.length === 2 && ids.every(id => byLocal.has(id)), 'Invalid LOCAL separation owners'); const endpoints = ids.map(id => byLocal.get(id)); ok(endpoints[0] !== endpoints[1], 'Separation inside merged canonical component'); result.add(identityPairKey(...endpoints)); } return result;
}
const separateCanonical = canonicalLocalPairs(resolved.keepSeparate);
for (const key of resolved.possibleSameAs) { const ids = key.split('\u0000'); ok(ids.length === 2 && ids[0] !== ids[1] && ids.every(id => canonicalIds.has(id)), 'Invalid CANONICAL possible-same-as owners'); }
for (const [key] of targetPairs) ok(!separateCanonical.has(key) && !resolved.possibleSameAs.has(key), 'Compiler rescheduled a previously closed canonical target pair');
const report = {schemaVersion: 1, status: 'Exact current graph analysis only; not identity approval, full CI or publication', canonicalRevision: ref, startedAt, recordedAt: new Date().toISOString(), elapsedSeconds: (performance.now() - wallStart) / 1000, memory: process.memoryUsage(), validatedExtractions: checked, localPeople: localPeople.size, canonicalPeople: resolved.clusters.length, resolutionDocuments: documents.length, possibleSameAsClosedCanonicalPairs: resolved.possibleSameAs.size, unresolvedBlocks: unresolved.blocks.length, remainingReviewPairs: unresolved.blocks.reduce((n, b) => n + b.reviewPairs.length, 0), selectedTargets: targets, selectedWork: Object.fromEntries(targets.map(t => [t, work[t] ?? {unresolvedBlocks: 0, comparisons: 0}])), remainingDistinctTargetPairs: targetPairs.size, selectedCompleteEndpointLocalPeople: endpointClusters.reduce((n, c) => n + c.localPeople.length, 0), assignmentScope: 'ONLY remainingDistinctReviewPairs touching actual Jin053 canonical people; external-only block pairs are NOT assignments', closedPairReschedulingAssertion: 'PASS', rawPrefixDiagnostic: {blocks: rawPrefixBlocks.length, distinctTouchingCanonicalPairs: rawPrefixPairs.size}, selectedWorkCounterSemantics: 'Legacy chapter counters use raw block-local chapter membership; canonicalTargetScope and remainingDistinctTargetPairs govern the complete target identity scope', canonicalTargetScope: {blocks: blocks.length, targetCanonicalPeople: targetCanon.size, distinctReviewPairs: targetPairs.size, pairsMissingFromRawPrefixSelection: [...targetPairs].filter(([key]) => !rawPrefixPairs.has(key)).map(([, pair]) => pair)}};
const write = (name, value) => fs.writeFileSync(out + '/' + name, JSON.stringify(value, null, 2) + '\n');
write('selected-complete-endpoint-clusters.json', {canonicalRevision: ref, status: 'Actual complete current endpoint membership; no identity approval', targetCanonicalPeople: [...targetCanon], remainingDistinctReviewPairs: [...targetPairs.values()], endpointClusters: endpointClusters.map(c => ({canonicalPersonId: c.canonicalPersonId, localPeople: c.localPeople})), localToCanonical: Object.fromEntries(endpointClusters.flatMap(c => c.localPeople.map(id => [id, c.canonicalPersonId])))});
write('selected-current-blocks.json', {schemaVersion: 1, status: 'Read-only graph evidence; external-only block pairs are not assignments', canonicalRevision: ref, targetChapters: targets, blocks, people: Object.fromEntries([...visible].map(id => [id, {...candidate.people[id], currentCanonicalPersonId: byLocal.get(id)}]))});
// Reconcile every old member, never infer continuity from obsolete canonical strings.
const membershipReconciliation = original.endpointClusters.map(c => { const next = [...new Set(c.localPeople.map(id => { ok(byLocal.has(id), 'Missing original local owner: ' + id); return byLocal.get(id); }))].sort(); return {oldCanonicalPersonId: c.canonicalPersonId, oldFullMemberIds: c.localPeople, currentCanonicalPersonIds: next, status: next.length === 1 ? 'SINGLE_CURRENT_COMPONENT' : 'OLD_COMPONENT_SPLIT_REQUIRES_RECONCILIATION'}; });
const remap = new Map(membershipReconciliation.map(c => [c.oldCanonicalPersonId, c.currentCanonicalPersonIds])), mappedOriginalKeys = new Set(), currentPairKeys = new Set(targetPairs.keys());
const pairReconciliation = original.remainingDistinctReviewPairs.map(oldPair => { const mapped = oldPair.map(id => { ok(remap.has(id), 'Original pair endpoint missing'); return remap.get(id); }); return {oldPair, splitReconciliationRequired: mapped.some(ids => ids.length > 1), currentCombinations: mapped[0].flatMap(a => mapped[1].map(b => {const key = identityPairKey(a, b); mappedOriginalKeys.add(key); return {pair: [a, b].sort(), status: a === b ? 'COLLAPSED_CURRENT_SAME_COMPONENT' : separateCanonical.has(key) ? 'CLOSED_BY_CURRENT_SEPARATION' : resolved.possibleSameAs.has(key) ? 'CLOSED_BY_CURRENT_POSSIBLE_SAME_AS' : currentPairKeys.has(key) ? 'REMAINS_CURRENT_TOUCHING_TARGET_PAIR' : 'NO_LONGER_CURRENT_CANDIDATE_NO_IDENTITY_VERDICT'};}))}; });
const newlyExposedCurrentPairs = [...targetPairs].filter(([key]) => !mappedOriginalKeys.has(key)).map(([, pair]) => pair);
const splitComponents = membershipReconciliation.filter(row => row.currentCanonicalPersonIds.length !== 1);
report.scopeReconciliation = {baselinePairs: 1363, newCanonicalTargetPairs: newlyExposedCurrentPairs.length, oldComponentsSplit: splitComponents.length, replanRequired: newlyExposedCurrentPairs.length > 0 || splitComponents.length > 0, status: newlyExposedCurrentPairs.length > 0 || splitComponents.length > 0 ? 'HOST_EXPLICIT_REPLAN_REQUIRED_BEFORE_ANY_WORKER_ASSIGNMENT' : 'NO_ADDED_PAIRS_OR_SPLITS; further review/publication gates remain'};
const clusterById = new Map(resolved.clusters.map(c => [c.canonicalPersonId, c]));
for (const row of membershipReconciliation) row.currentFullComponents = row.currentCanonicalPersonIds.map(id => ({canonicalPersonId: id, localPeople: clusterById.get(id).localPeople}));
write('original1363-reconciliation.json', {canonicalRevision: ref, originalInput: {path: originalPath, sha256: sha(originalRaw)}, originalPairs: 1363, currentTouchingPairs: targetPairs.size, newlyExposedCurrentPairs, scopeReconciliation: report.scopeReconciliation, rawPrefixDiagnostic: report.rawPrefixDiagnostic, canonicalTargetScope: report.canonicalTargetScope, membershipReconciliation, pairReconciliation, status: 'Mechanical complete-member remap only; splits/new pairs require explicit host reconciliation, not identity verdicts'});
// Bounded normal context owns all target components and current remaining endpoint components only.
const owned = new Set(resolved.clusters.filter(c => targetCanon.has(c.canonicalPersonId) || endpointCanon.has(c.canonicalPersonId)).flatMap(c => c.localPeople)), contextIds = new Set(owned), allExplicit = explicitIdentityConstraints(localPeople), explicitEdges = [...allExplicit.same].map(key => ({key, kind: 'same-person-explicit'})).concat([...allExplicit.different].map(key => ({key, kind: 'different-person'})));
for (const document of documents) for (const decision of document.decisions) if (decision.localPeople.some(id => owned.has(id))) for (const id of decision.localPeople) {ok(localPeople.has(id), 'Missing whole owned constraint member'); contextIds.add(id);}
for (const edge of explicitEdges) {const ids = edge.key.split('\u0000'); if (ids.some(id => owned.has(id))) for (const id of ids) contextIds.add(id);}
for (const id of [...contextIds]) for (const member of clusterById.get(byLocal.get(id)).localPeople) contextIds.add(member);
const hostPeople = new Map([...contextIds].sort().map(id => [id, localPeople.get(id)])), closedDocuments = [], outside = [];
let touchingDecisions = 0;
for (const [docIndex, document] of documents.entries()) {
  const selected = [];
  for (const [index, decision] of document.decisions.entries()) {
    const missing = decision.localPeople.filter(id => !contextIds.has(id));
    if (decision.localPeople.some(id => owned.has(id))) {touchingDecisions++; ok(missing.length === 0, 'Owned whole hard constraint closure incomplete');}
    if (!missing.length) selected.push(decision);
    else if (decision.localPeople.some(id => contextIds.has(id))) outside.push({path: resolutionPaths[docIndex], index, decision: decision.decision, localPeople: decision.localPeople, missingIds: missing, affectsOwned: false});
  }
  if (selected.length) closedDocuments.push({...document, decisions: selected});
}
const closed = resolvePeopleClusters(hostPeople, closedDocuments), closedByLocal = new Map(closed.clusters.flatMap(c => c.localPeople.map(id => [id, c])));
ok(closedByLocal.size === hostPeople.size, 'Bounded resolver lost members');
for (const [id] of hostPeople) {const actual = clusterById.get(byLocal.get(id)), bounded = closedByLocal.get(id); ok(bounded && actual.canonicalPersonId === bounded.canonicalPersonId && JSON.stringify(actual.localPeople) === JSON.stringify(bounded.localPeople), 'Bounded mapping/FULL component differs actual global: ' + id);}
const contextChapterKeys = new Set([...hostPeople.values()].map(p => p.book + ':' + p.chapter));
const chapterInputs = Object.fromEntries([...contextChapterKeys].sort().map(key => [key, {sourcePath: 'data/' + key.replace(':', '/') + '.json', extractionPath: 'data/people/extractions/' + key.replace(':', '/') + '.json', normalizedInput: normalizedChapterInputs.get(key), sourceAndExtractionRawPins: inputPins.filter(p => p.path === 'data/' + key.replace(':', '/') + '.json' || p.path === 'data/people/extractions/' + key.replace(':', '/') + '.json')}]));
const contextCandidate = buildResolutionCandidates(hostPeople), fields = {canonicalRevision: ref, status: 'Actual current source/whole-decision closed context; no source approval or full CI', people: Object.fromEntries(hostPeople), candidateSummaries: contextCandidate.people, ownedLocalPeople: [...owned].sort(), completeCurrentClusters: closed.clusters, wholeClosedDocumentHeaders: closedDocuments.map(({decisions, ...header}) => ({...header, decisionCount: decisions.length})), wholeClosedDecisionEntries: closedDocuments.flatMap(d => d.decisions.map((decision, index) => ({batch: d.batch, index, decision}))), explicitConstraints: explicitEdges.filter(e => e.key.split('\u0000').every(id => contextIds.has(id))), chapterInputs, outsideValidationOnlyConstraints: outside};
fs.mkdirSync(out + '/closed-context-shards');
const maximumShardBytes = 2 * 1024 * 1024, manifest = {canonicalRevision: ref, status: fields.status, maximumShardBytes, serializer: {path: LINEAR, sha256: LINEAR_SHA}, reconstruction: 'Read field encoding; reconstruct WHOLE decisions by matching batch/header and exact index0..decisionCount-1; never project decisions', fields: []};
let shardNumber = 0;
for (const [key, value] of Object.entries(fields)) {
  if (value === null || typeof value !== 'object') {manifest.fields.push({key, encoding: 'inline', value}); continue;}
  const encoding = Array.isArray(value) ? 'ordered-array' : 'ordered-object-entries', entries = Array.isArray(value) ? value : Object.entries(value), parts = [];
  for (const raw of linearJsonShards(key, encoding, entries, maximumShardBytes)) {const file = 'closed-context-shards/part-' + String(++shardNumber).padStart(4, '0') + '.json'; fs.writeFileSync(out + '/' + file, raw); parts.push({file, bytes: raw.length, sha256: sha(raw)});}
  manifest.fields.push({key, encoding, entryCount: entries.length, parts});
}
write('closed-context-manifest.json', manifest);
write('closed-context-proof.json', {canonicalRevision: ref, actualFullGlobalPeople: localPeople.size, actualCurrentResolutionDocuments: documents.length, ownedContextPeople: owned.size, hostPeople: hostPeople.size, wholeClosedDocuments: closedDocuments.length, wholeClosedDecisions: closedDocuments.reduce((n, d) => n + d.decisions.length, 0), actualDecisionsTouchingOwned: touchingDecisions, allOwnedWholeHardConstraintsComplete: true, allHostCurrentCanonicalMappingsAndFULLComponentsMatchFreshGlobalGraph: true, contextOnlyOutsideConstraints: outside.length, shards: shardNumber, sourceAccess: 'ExactGit source/extraction fingerprints retained; no chapter source registry copies', globalCIPassed: false, independentApproval: false});
write('input-pin-manifest.json', {canonicalRevision: ref, sourceBase: SOURCE_BASE, actualBuilder: builderPin, configRoot: CONFIG_ROOT, runtime, dependencyPins, compilerPin, compilerCanonicalSha256: COMPILER_SHA, pureFunctionSourceSha256: pureSha, compilerExecution: compilerPin.execution, linearSerializer: {path: LINEAR, sha256: LINEAR_SHA}, qualificationPinManifest: {path: qualificationPath, sha256: sha(qualificationRaw), inputs: qualification.inputs}, inputPins});
report.elapsedSeconds = (performance.now() - wallStart) / 1000; report.recordedAt = new Date().toISOString();
write('graph-summary.json', report);
const outputPins = fs.readdirSync(out, {withFileTypes: true}).filter(f => f.isFile() && f.name !== 'completion-seal.json').map(f => {const bytes = fs.readFileSync(out + '/' + f.name); return {file: f.name, bytes: bytes.length, sha256: sha(bytes)};});
write('completion-seal.json', {canonicalRevision: ref, actualBuilder: builderPin, status: 'One exact graph refreshed; bounded normal FULL mapping verified. NOT CI, source approval, identity approval or publication', outputPins, closedContextManifestSha256: sha(fs.readFileSync(out + '/closed-context-manifest.json')), original1363ReconciliationSha256: sha(fs.readFileSync(out + '/original1363-reconciliation.json')), independentApproval: false});
console.log(JSON.stringify({graphComplete: true, canonicalRevision: ref, remainingDistinctTargetPairs: targetPairs.size, closedContextPeople: hostPeople.size, elapsedSeconds: (performance.now() - wallStart) / 1000, output: out, noIdentityApproval: true}));
