import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pinnedIdentityChapterContext} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-pinned-identity-source.mjs';
import {loadProperNounMatcher} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-candidates.mjs';
import {buildDateAuditPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import {dateReviewJobs} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-workflow.mjs';
import {validateAppliedEditorialDecisions} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
import {dateWorkerInput} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-worker.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',dir=new URL('./current-source-date-parts/',import.meta.url).pathname;
const need=(v,m)=>{if(!v)throw Error(m)},hash=b=>createHash('sha256').update(b).digest('hex');
need(!fs.existsSync(dir+'preparation-receipt.json'),'Preserve existing sealed preparation');
const context=pinnedIdentityChapterContext(root,'e4e9ac83606c1690db50ca9d7b177801379e2995');
{
 const validated=context.load('jinshu','109',{properNounMatcher:loadProperNounMatcher(),strictAliasDispositions:true});
 validateAppliedEditorialDecisions(context.editorial('jinshu','109'),validated.extraction);
 for(const file of ['data/jinshu/109.json','data/people/extractions/jinshu/109.json','data/people/editorial-decisions/jinshu/109.json'])need(fs.readFileSync(root+'/'+file).equals(context.snapshot.read(file)),'Current source differs from reviewed snapshot');
 const packet=buildDateAuditPacket('jinshu','109',{dataDir:root+'/data',peopleDir:root+'/data/people'});
 need(packet.sourceHash==='sha256:6be284e18f5f87a2f72c4ee2cfe266b62fa769a684fdc4b2b5ba5b4526d2aa38'&&packet.extractionHash==='sha256:939c2e595e93dbf2804b1b1d6438650e95d2ec8b279678aa9453c19d4f82760a','Reviewed date packet changed');
 const jobs=dateReviewJobs(packet,{maxUnits:40,maxBytes:48*1024}),rows=[];
 fs.mkdirSync(dir,{recursive:true});
 for(const [i,job]of jobs.entries()){
  const file=dir+`part-${String(i+1).padStart(3,'0')}.input.json`,input=dateWorkerInput({kind:'review',key:'audit-0-'+job.id,job,packet}),bytes=Buffer.from(JSON.stringify(input)+'\n');
  need(bytes.length<64*1024-2048,'Worker attachment leaves insufficient prompt space');
  fs.writeFileSync(file,bytes,{flag:'wx'});rows.push({index:i,jobId:job.id,file,bytes:bytes.length,sha256:hash(bytes),ownedUnits:job.ownedUnits.length,ownedItems:job.ownedItems.length,ownedPeople:job.ownedPeople.length,phase:'prepared',agentId:null,providerRunId:null});
 }
 for(const [field,total]of [['ownedUnits',packet.units.length],['ownedItems',packet.items.length],['ownedPeople',packet.people.length]]){const ids=jobs.flatMap(j=>j[field]);need(ids.length===total&&new Set(ids).size===total,'Incomplete or duplicated native date ownership: '+field)}
 fs.writeFileSync(dir+'native-jobs.json',JSON.stringify(jobs,null,2)+'\n',{flag:'wx'});
 fs.writeFileSync(dir+'packet.json',JSON.stringify(packet,null,2)+'\n',{flag:'wx'});
 const receipt={at:new Date().toISOString(),scope:{book:'jinshu',chapter:'109'},sourceRevision:'e4e9ac83606c1690db50ca9d7b177801379e2995',runtimeCodeRevision:'03ecda055cfff2abb05d5fcfd6590315efa8ba8d',productionExtractionValidationPassed:true,currentSourceMatchesReviewedSnapshot:true,sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,jobs:rows,ownedCoverage:{units:packet.units.length,items:packet.items.length,people:packet.people.length},maxUnits:40,maxBytes:48*1024,modelsDispatched:0,dateApproval:false,chapterApproved:false};
 fs.writeFileSync(dir+'preparation-receipt.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({jobs:rows.length,maxAttachmentBytes:Math.max(...rows.map(r=>r.bytes)),coverage:receipt.ownedCoverage,normalValidation:true,modelsDispatched:0,dateApproval:false}));
}
