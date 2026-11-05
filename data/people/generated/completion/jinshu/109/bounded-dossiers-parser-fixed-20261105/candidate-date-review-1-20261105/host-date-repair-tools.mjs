import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {applyDateRepairProposal} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-workflow.mjs';
import {buildDateAuditPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import {validateCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
import {validateAppliedEditorialDecisions} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
export const root='/Users/garrettpetersen/records-of-the-grand-historian',dir=new URL('.',import.meta.url).pathname,v=dir+'reviewed-English-source-prepared-v3/';
export const read=p=>JSON.parse(fs.readFileSync(p)),clone=structuredClone,need=(condition,message)=>{if(!condition)throw Error(message)},hash=b=>createHash('sha256').update(b).digest('hex'),write=(p,value)=>fs.writeFileSync(p,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
export const year=n=>({era:'AD',year:n,precision:'year'}),interval=(a,b)=>({start:year(a),end:year(b)});
export function draftGroup(number){
 need(!inspectLocalDisk(root).errors.length,'Resource guard hold');
 const suffix=String(number).padStart(3,'0'),previous=dir+'host-date-repair-group'+String(number-1).padStart(3,'0')+'/',out=dir+'host-date-repair-group'+suffix+'/';
 need(!fs.existsSync(out),'Preserve previous host draft');
 const stored=read(previous+'candidate.json'),packet=read(previous+'date-packet.json'),baseline=read(v+'date-replay-candidate.json'),baselinePacket=read(v+'date-replay-packet.json'),plan=read(dir+'host-date-repair-plan.json');
 const currentIndex=new Map(),baselineIndex=new Map(baseline.claims.map((c,i)=>['claim-'+(i+1),i]));
 stored.claims.forEach((c,i)=>{const key=JSON.stringify(c),ids=currentIndex.get(key)??[];ids.push(i);currentIndex.set(key,ids)});
 const target=id=>{need(baselineIndex.has(id),'Unknown baseline temporal target '+id);const original=overrides.has(id)?overrides.get(id):baseline.claims[baselineIndex.get(id)],matches=currentIndex.get(JSON.stringify(original));need(matches?.length===1,'Baseline target changed or ambiguous: '+id);return {id:'claim-'+(matches[0]+1),row:stored.claims[matches[0]]}};
 const changes=[],withdrawals=[],explicitRebases=[],overrides=new Map();
 const rebase=(id,groupNumber)=>{const old=baseline.claims[baselineIndex.get(id)],prior=read(dir+'host-date-repair-group'+String(groupNumber).padStart(3,'0')+'/proposal.json');const matches=prior.changes.filter(c=>c.kind==='replace'&&JSON.stringify(c.before)===JSON.stringify(old));need(matches.length===1,'Explicit rebase requires one exact prior replacement');overrides.set(id,matches[0].after);explicitRebases.push({baselineId:id,priorGroup:groupNumber,after:clone(matches[0].after)})};
 const life=(id,date,reason,evidence)=>{const t=target(id),before=clone(t.row),after=clone(before);if(before[2].dateContext)after[2].dateContext=clone(date);else after[2]=clone(date);if(evidence)after[4]=evidence;changes.push({kind:'replace',id:t.id,before,after,reason})};
 const context=(id,date,reason)=>{const t=target(id),before=clone(t.row[2].dateContext??null),after=clone(date);if(before?.event!==undefined)after.event=before.event;changes.push({kind:'date-context',id:t.id,before,after,reason})};
 const clearContext=(id,reason)=>{const t=target(id),before=clone(t.row),after=clone(before);need(after[2].dateContext,'No temporal context to withdraw');delete after[2].dateContext;changes.push({kind:'replace',id:t.id,before,after,reason})};
 const replaceValue=(id,value,reason)=>{const t=target(id),before=clone(t.row),after=clone(before);after[2]=clone(value);changes.push({kind:'replace',id:t.id,before,after,reason})};
 const remove=(id,reason)=>{const t=target(id);withdrawals.push({baselineId:id,currentId:t.id,before:clone(t.row),reason});changes.push({kind:'remove',id:t.id,before:clone(t.row),reason})};
 const add=(row,reason)=>changes.push({kind:'add',after:row,reason});
 const reception=(row,reason)=>changes.push({kind:'add-reception-event',after:row,reason});
 const hints=values=>{for(const[personId,after]of Object.entries(values)){const p=stored.people.find(p=>p[0]===personId);need(p,'Unknown hint person');changes.push({kind:'hints',personId,before:clone(p[4]?.a??[]),after,reason:'Synchronize activity hints with this person’s retained concrete evidence. Preserve unresolved witness conflicts without manufacturing a year; retain other supported episode windows.'})}};
 const finish=(references,extra={})=>{
  const proposal={sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,author:{name:'Codex host',agentId:'codex-thread:01a18e17-07b3-7f13-8e34-cb207908be33'},changes};
  const candidate=applyDateRepairProposal(stored,proposal,packet),validated=validateCompactPeopleExtraction(candidate,read(v+'prospective-packet.json'),{strictAliasDispositions:true});validateAppliedEditorialDecisions(read(v+'editorial.json'),validated.normalized);
  const candidatePacket=buildDateAuditPacket('jinshu','109',{dataDir:v+'date-input',peopleDir:root+'/data/people',extraction:candidate});
  need(JSON.stringify(candidate.people.map(p=>[p[0],p[1],p[2],p[3],p[5]]))===JSON.stringify(stored.people.map(p=>[p[0],p[1],p[2],p[3],p[5]])),'Person identities/names changed');
  const dateFields=new Set(['dateContext','sourceDate','westernYear','westernInterval','westernBounds','unresolved','unresolvedReason']);
  const immutable=c=>JSON.stringify([c[0],c[1],Object.fromEntries(Object.entries(c[2]).filter(([k,value])=>!dateFields.has(k)&&!(k==='receptionType'&&value==='retrospective'))),c[3],c[4]]),available=new Map();
  for(const c of candidate.claims){const k=immutable(c);available.set(k,(available.get(k)??0)+1)}
  const withdrawn=new Set(withdrawals.map(x=>JSON.stringify(x.before)));
  for(const c of stored.claims){if(['attestation','birth','death','age'].includes(c[1])||withdrawn.has(JSON.stringify(c)))continue;const k=immutable(c),count=available.get(k)??0;need(count>0,'Unexplained non-date fact loss');available.set(k,count-1)}
  fs.mkdirSync(out);write(out+'proposal.json',proposal);write(out+'candidate.json',candidate);write(out+'date-packet.json',candidatePacket);write(out+'primary-source-references.json',references);
  const receipt={at:new Date().toISOString(),kind:'host-authored-prospective-native-date-repair',group:suffix,futureNativeJobKey:'repair-1-'+plan.groups[number-1].id+'-'+packet.extractionHash.slice(7,19),sourceApplicationRequired:true,nativeWorkflowAdopted:false,proposalSha256:hash(fs.readFileSync(out+'proposal.json')),baselineExtractionHash:packet.extractionHash,candidateExtractionHash:candidatePacket.extractionHash,assignedFindings:plan.groups[number-1].findings.length,changes:changes.length,people:validated.stats.people,expandedClaims:validated.stats.claims,dateItems:candidatePacket.items.length,normalValidation:true,editorialValidation:true,explicitWithdrawals:withdrawals,explicitRebases,otherExistingNonDateFactsPreserved:true,independentDateApproval:false,canonicalWrites:0,paidModelCalls:0,...extra};write(out+'receipt.json',receipt);console.log(JSON.stringify({...receipt,explicitWithdrawals:withdrawals.map(x=>({baselineId:x.baselineId,currentId:x.currentId})),explicitRebases:explicitRebases.map(x=>({baselineId:x.baselineId,priorGroup:x.priorGroup}))}));return receipt;
 };
 return {stored,packet,target,rebase,life,context,clearContext,replaceValue,remove,add,reception,hints,finish};
}
