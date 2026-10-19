// Independent reviewer-authored decision for the exact retained proposal only.
// Does not materialize or publish any changes.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '../../scripts/build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from '../../scripts/lib/people-candidates.mjs';
import { validateCompactPeopleExtraction } from '../../scripts/validate-people-extraction.mjs';
import { validateEditorialDecisions } from '../../scripts/lib/people-editorial-decisions.mjs';

function readPinned(file, hash) {
  const bytes = fs.readFileSync(file);
  if (createHash('sha256').update(bytes).digest('hex') !== hash) throw new Error(`Input changed: ${file}`);
  return JSON.parse(bytes);
}
const base = 'data/people/generated/editorial-review/jinshu/108-s0090-recovery-20261020-incomplete';
const seed = readPinned(`${base}/decision-seed.json`, 'f10f52baa17169dd0fd1b9e3c26ea491e15c19130a7caef21d2609c0a34e809e');
const compact = readPinned(`${base}/proposed-candidate.json`, 'ff65c8a2d675f8ad532693a02bf4ac9f9cde384b880a9e01112693aed55c5f35');
const source = readPinned('data/jinshu/108.json', '8c3f789a55588e130f64eac778decf43ebde6809f3ecb81ddc91b54a76d6cfbb');
const state = readPinned('data/people/generated/date-workflow/jinshu/108/state.json', '7e5276a61f60c482bf32c0b30a0091423de38105626877c07436b7d8d75db152');
const reviewerId = '/root/date127';
const excluded = new Set(['/root/editorial108','/root/pub_path_new',compact.run.agentId,...Object.entries(state.jobs).filter(([id]) => id.startsWith('repair-')).map(([,value])=>value.agentId)]);
if (excluded.has(reviewerId)) throw new Error('Reviewer is an identified proposal, extraction, or retained repair author');
seed.reviewer = {kind:'codex',name:'Independent Codex editorial reviewer',model:null,agentId:reviewerId,runId:null,completedAt:'2026-10-19T07:22:34Z'};
for (const decision of seed.decisions) {
  decision.decision = 'accept';
  decision.reason = 'The pinned source explicitly reads 廆懼，首服. 廆 names Hui, 懼 expresses fear, and the dictionary supports confession for 首服. The conflicting digital transcription requires a separately reviewed visible note before publication; this decision does not emend Chinese.';
  decision.sourceWitness = {source:'chapter-text',citation:'data/jinshu/108.json s0090',excerpt:'廆懼，首服。'};
}
const packet = buildPeopleExtractionPacket('jinshu','108',{chapterData:source,properNounMatcher:loadProperNounMatcher()});
const normalized = validateCompactPeopleExtraction(compact,packet,{strictAliasDispositions:true}).normalized;
validateEditorialDecisions(seed,normalized,packet);
const output = `${base}/independent-decisions-date127-20261020-incomplete.json`;
fs.writeFileSync(output,`${JSON.stringify(seed,null,2)}\n`,{flag:'wx'});
console.log(JSON.stringify({output,sha256:createHash('sha256').update(fs.readFileSync(output)).digest('hex'),status:'two editorial decisions only; no materialization, footnote approval or publication'}));
