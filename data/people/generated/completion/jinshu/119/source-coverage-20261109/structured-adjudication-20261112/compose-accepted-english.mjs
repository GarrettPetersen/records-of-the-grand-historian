import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {buildPeopleExtractionPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url)),base=path.dirname(dir);
const read=p=>JSON.parse(fs.readFileSync(p));
const digest=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const packet=buildPeopleExtractionPacket('jinshu','119');
const original=read(path.join(base,'independent-decisions/validated-review.json'));
const supplements=read(path.join(base,'supplemental-adjudication-20261112/accepted-english-fields.json'));
const decisions=new Map(original.decisions.map(x=>[x.repairId,x]));
const fields=new Map();
for(const p of original.proposals){
 const decision=decisions.get(p.id);if(!decision||!['accept','revise'].includes(decision.decision))throw new Error('Unaccepted prior proposal '+p.id);
 const key=p.unit.id+'|'+p.field;if(fields.has(key))throw new Error('Duplicate original target '+key);
 const unit=packet.units.find(u=>u.id===p.unit.id);const before=p.field==='idiomatic'?unit.en:unit.literal;
 if(before!==p.before)throw new Error('Canonical before drift '+key);
 fields.set(key,{book:'jinshu',chapter:'119',unitId:p.unit.id,field:p.field,before,after:decision.decision==='revise'?decision.after:p.after,originalRepairId:p.id,provenance:[{file:path.join(base,'independent-decisions/validated-review.json'),sha256:digest(path.join(base,'independent-decisions/validated-review.json')),reviewer:original.reviewer.agentId,repairId:p.id,decision:decision.decision}]});
}
let overlap=0;
for(const supplement of supplements.repairs){
 const key=supplement.unitId+'|'+supplement.field;let row=fields.get(key);
 if(row){if(row.after!==supplement.before)throw new Error('Supplement draft before drift '+key);overlap++;}
 else{const unit=packet.units.find(u=>u.id===supplement.unitId);if(!unit)throw new Error('Missing source '+key);const before=supplement.field==='idiomatic'?unit.en:unit.literal;if(before!==supplement.before)throw new Error('New-field canonical before drift '+key);row={book:'jinshu',chapter:'119',unitId:supplement.unitId,field:supplement.field,before,after:before,originalRepairId:null,provenance:[]};fields.set(key,row);}
 row.after=supplement.after;row.provenance.push({file:path.join(base,'supplemental-adjudication-20261112/accepted-english-fields.json'),sha256:digest(path.join(base,'supplemental-adjudication-20261112/accepted-english-fields.json')),reviewer:supplement.reviewer,proposalId:supplement.proposalId,decision:supplement.reviewDecision,sourceWitness:supplement.sourceWitness,reason:supplement.reason});
}
if(fields.size!==283||overlap!==1)throw new Error('Unexpected field accounting');
const output={schemaVersion:1,kind:'composed-independently-accepted-English-fields',book:'jinshu',chapter:'119',canonicalSourceSha256:digest(path.join(process.env.PEOPLE_REPO_ROOT,'data/jinshu/119.json')),originalDecisions:268,supplements:16,overlappingTargets:overlap,distinctFields:fields.size,repairs:[...fields.values()],canonicalApplied:false,chapterApproved:false};
const out=path.join(dir,'coherent-english-fields.json');fs.writeFileSync(out,JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,sha256:digest(out),distinctFields:fields.size,overlap,canonicalChanges:0}));
