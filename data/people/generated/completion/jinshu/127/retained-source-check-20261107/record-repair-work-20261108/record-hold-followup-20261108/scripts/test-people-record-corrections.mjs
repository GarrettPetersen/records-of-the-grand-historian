import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { replayRecordCorrections, runRecordCorrections } from './lib/people-record-corrections.mjs';
import { buildPeopleExtractionPacket, buildPeopleExtractionSeed } from './build-people-extraction-packet.mjs';
import { buildCompactInput } from './lib/people-compact.mjs';
import { inspectCombinedBefore } from './lib/people-combined-curation.mjs';
import { readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { editorialDecisionSeed } from './lib/people-editorial-decisions.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';

function fixture(t, includeChange = () => true) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'record-correction-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const book = 'testbook', chapter = '001', owner = 'fixture-owner', generationId = 'fixture-generation';
  const unit = { id: 's0001', zh: '李明來。', translations: [{ lang: 'en', literal: 'Li Ming came.', idiomatic: 'Li Ming came.' }] };
  const source = { meta: { book, chapter }, content: [{ sentences: [unit] }] };
  const sourceFile = path.join(root, 'data', book, chapter + '.json');
  writeJsonAtomic(sourceFile, source);
  const packet = buildPeopleExtractionPacket(book, chapter, { chapterData: source, chapterFile: sourceFile, properNounMatcher: loadProperNounMatcher() });
  const people = path.join(root, 'data/people');
  const extraction = { schemaVersion: 2, book, chapter, input: buildCompactInput(packet),
    run: { model: 'fixture', promptVersion: 7, agentId: 'extractor' },
    people: [['p001', ['Li Ming', '李明', null], 'historical', 'Named official.', { n: [], r: [], a: ['AD 1'], p: [], x: null },
      [[{ kind: 'personal-name', en: 'Ly Ming', zh: '李明' }, 'explicit', ['s0001']]], [['official', 'explicit', ['s0001']]]]],
    claims: [['p001', 'assessment', { assessment: 'Ming arrived.', provenance:{mode:'named-speaker',speakerPersonId:'p001'} }, 'explicit', ['s0001']],
      ['p001', 'attestation', {event:'Arrived.', sourceDate:{text:'Fixture year'},westernYear:{era:'AD',year:1,precision:'year'}}, 'explicit', ['s0001']]],
    surfaces: [['p001', 'personal-name', 'en', 'Li Ming', [['s0001', [0]]]]],
    translationRepairs: [], candidateDispositions: [],
    coverage: Object.fromEntries(Object.entries(buildPeopleExtractionSeed(packet, 'fixture').coverage).map(([k,v]) => [k, typeof v === 'boolean' ? true : v])) };
  const file = path.join(people, 'extractions', book, chapter + '.json');
  writeJsonAtomic(file, extraction);
  const editorial = editorialDecisionSeed(validateCompactPeopleExtraction(extraction, packet, { strictAliasDispositions: true }).normalized);
  editorial.reviewer = { kind: 'human', name: 'Fixture editor', model: null, agentId: 'previous-editor', runId: null, completedAt: '2026-09-01T00:00:00Z' };
  writeJsonAtomic(path.join(people,'editorial-decisions',book,chapter+'.json'), editorial);
  writeJsonAtomic(path.join(people,'generated/date-workflow',book,chapter,'state.json'), { phase: 'complete', round: 2 });
  const before = inspectCombinedBefore({ root, book, chapter });
  const availableChanges = [
    { type:'alias-wording', person:'p001', unit:'s0001', pointer:'/people/0/5/0/0/en', before:'Ly Ming', after:'Li Ming', witness:'李明' },
    { type:'assessment-wording', person:'p001', unit:'s0001', pointer:'/claims/0/2/assessment', before:'Ming arrived.', after:'Li Ming arrived.', witness:'李明來' },
    { type:'add-mention', person:'p001', unit:'s0001', exact:'李明', language:'zh', kind:'personal-name', occurrence:0, witness:'李明來' }
  ];
  const changes = availableChanges.filter(includeChange);
  const candidate = replayRecordCorrections(extraction, packet.units, changes);
  const beforeFile = 'before.json', candidateFile = 'candidate.json';
  fs.copyFileSync(file,path.join(root,beforeFile));writeJsonAtomic(path.join(root,candidateFile),candidate);
  const hashFile = f => sha256(fs.readFileSync(f,'utf8'));
  const recordPacket = path.join(root,'packet.json');
  const input = {kind:'chapter-record-corrections-v1',book,chapter,beforeFile,candidateFile,owner,generationId,
    sourceHash:before.sourceHash,extractionHash:before.extractionHash,authorId:'curator',excludedReviewerIds:['curator'],before,changes,candidateHash:sha256(JSON.stringify(candidate)),
    candidateByteHash:hashFile(path.join(root,candidateFile)) };
  writeJsonAtomic(recordPacket,input);
  const resultFile = path.join(root,'report.json');
  const hash = hashFile(recordPacket).slice(7);
  writeJsonAtomic(resultFile,{kind:'independent-record-correction-review',book,chapter,candidateHash:input.candidateHash,
    packetSha256:hash,reviewer:{agentId:'reviewer',independentOfAuthors:true},supplementalRepairs:[],
    decisions:changes.map((change,index)=>({index,verdict:'accept',witness:change.witness,reason:'Checked the complete source sentence.'}))});
  const job = { kind:'independent-record-correction-review', status:'returned', inputSha256:hash, agentId:'reviewer',
    runId:'actual-fixture-run', resultFile, resultSha256:hashFile(resultFile).slice(7) };
  const row = {worker:owner,generationId,sourceHash:before.sourceHash,extractionHash:before.extractionHash,status:'research-blocked',lane:'grokbot',
    jobs:{review:job},candidateStage:{phase:'source-reconciliation-hold',priorNativeRound:2,maxRepairRounds:3,actualSourceAuthors:['curator'],
      unlinkedChineseWitnesses:[{expectedExistingPerson:'testbook:001:p001',unit:'s0001',zh:'李明',occurrence:0}],
      requiredRecordWordings:{targets:availableChanges.filter(c=>c.pointer).map(c=>c.pointer)},stagedCandidate:{changeCount:15}}};
  let ledger = {dateAudits:{'testbook/001':structuredClone(row)},claims:{}};
  const services = { guard:()=>({errors:[],primary:fs.realpathSync(root)}), mutateLedger(fn) {
    const draft = structuredClone(ledger), result = fn(draft);
    ledger=draft;return {result};
  }};
  const run = overrides => runRecordCorrections({recordPacket,root,apply:true},{...services,...overrides});
  return {run,file,input,row,get ledger(){return ledger},changes,extraction,packet,candidate};
}

test('preserves every unrelated record, including unnamed people and evidence', t => {
  const f=fixture(t), base=structuredClone(f.extraction);
  base.people.push(['p002', null, null, 'Unnamed intermediary', { x:'Cited kinship witness.' }]);
  const result=replayRecordCorrections(base,f.packet.units,f.changes);
  assert.deepEqual(result.people[1],base.people[1]);
  assert.deepEqual(result.people[0][5][0].slice(1),base.people[0][5][0].slice(1));
  assert.deepEqual(result.people[0][4],base.people[0][4]);
  assert.equal(result.people[0][5][0][0].zh,'李明');
  assert.deepEqual(result.surfaces.slice(0,-1),base.surfaces);
  assert.deepEqual(result.claims[0].slice(3),base.claims[0].slice(3));
  assert.throws(()=>replayRecordCorrections(base,f.packet.units,[{...f.changes[0],before:'stale'}]),/prior wording/);
  assert.throws(()=>replayRecordCorrections(base,f.packet.units,[{...f.changes[2],occurrence:2}]),/Could not find/);
  assert.throws(()=>replayRecordCorrections(result,f.packet.units,[f.changes[2]]),/already assigned/);
});

for (const stop of ['reserved','installed']) {
  test('recovers an interruption after '+stop+' and publishes once', t => {
    const f=fixture(t);
    assert.throws(()=>f.run({checkpoint(point){if(point===stop)throw Error('test interruption')}}),/test interruption/);
    assert.equal(f.run().status,'applied');
    assert.equal(f.run().status,'already-applied');
    assert.deepEqual(readJson(f.file),f.candidate);
    const row=f.ledger.dateAudits['testbook/001'];
    assert.equal(row.status,'research-blocked');assert.equal(row.candidateStage.priorNativeRound,2);
    assert.deepEqual(f.ledger.dateAuditHistory['testbook/001'],[f.row]);
    assert.equal(row.executorToken,undefined);
    assert.equal(row.candidateStage.unlinkedChineseWitnesses[0].linkedNow,true);
    assert.deepEqual(row.candidateStage.requiredRecordWordings.outstandingTargets,[]);
    assert.equal(row.candidateStage.stagedCandidate.requiresCurrentGenerationReconciliation,true);
  });
}
test('missing review, self-review, active owner and workflow drift each block publication', t => {
  const f=fixture(t), row=f.ledger.dateAudits['testbook/001'], job=row.jobs.review;
  delete row.jobs.review;assert.throws(()=>f.run(),/captured independent/);row.jobs.review=job;
  job.agentId='curator';assert.throws(()=>f.run(),/Self-reviewed/);job.agentId='reviewer';
  row.executorToken='other';assert.throws(()=>f.run(),/idle claim/);delete row.executorToken;
  writeJsonAtomic(path.resolve(path.dirname(f.file),'../../generated/date-workflow/testbook/001/state.json'),{phase:'complete',round:3});
  assert.throws(()=>f.run(),/workflow drift/);
  assert.deepEqual(readJson(f.file),f.extraction);
});

test('a later batch resolves only the remaining record wording', t => {
  const f = fixture(t, change => change.type === 'assessment-wording');
  const hold = f.ledger.dateAudits['testbook/001'].candidateStage.requiredRecordWordings;
  hold.outstandingTargets = [f.changes[0].pointer];
  hold.independentReviewRequired = true;
  assert.equal(f.run().status, 'applied');
  const current = f.ledger.dateAudits['testbook/001'].candidateStage.requiredRecordWordings;
  assert.deepEqual(current.outstandingTargets, []);
  assert.equal(current.status, 'reviewed-and-applied');
  assert.equal(current.independentReviewRequired, false);
});

test('an explicit mention preserves an existing partial wording hold', t => {
  const f = fixture(t, change => change.type === 'add-mention');
  const hold = f.ledger.dateAudits['testbook/001'].candidateStage.requiredRecordWordings;
  hold.outstandingTargets = [hold.targets[1]];
  hold.independentReviewRequired = true;
  assert.equal(f.run().status, 'applied');
  assert.deepEqual(f.ledger.dateAudits['testbook/001'].candidateStage.requiredRecordWordings, hold);
});

test('the new generation retains previous source authors and the correction author', t => {
  const f = fixture(t);
  f.ledger.dateAudits['testbook/001'].candidateStage.actualSourceAuthors = ['previous-curator'];
  assert.equal(f.run().status, 'applied');
  const current = f.ledger.dateAudits['testbook/001'].candidateStage;
  assert.deepEqual(current.actualSourceAuthors, ['previous-curator', f.input.authorId]);
  assert.deepEqual(f.ledger.dateAuditHistory['testbook/001'][0].candidateStage.actualSourceAuthors,
    ['previous-curator']);
});
