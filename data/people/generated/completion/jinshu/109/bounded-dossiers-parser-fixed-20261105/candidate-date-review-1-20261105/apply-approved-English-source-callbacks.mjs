import fs from 'node:fs';
import {dir,read,hash,same,need} from './complete-English-source-common.mjs';
import {exactSpanAt} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-content.mjs';
export function applyApprovedEnglishSourceCallbacks(extraction,packet,unresolved){
 const folder=dir+'complete-English-transition-20261106/',plan=read(folder+'source-callback-plan.json'),control=read(folder+'controller.json'),job=control.jobs.find(j=>j.stem==='source-callbacks-01');
 need(job?.phase==='returned'&&job.verdict==='approve'&&hash(fs.readFileSync(job.rawFile))===job.resultSha256&&hash(fs.readFileSync(job.inputFile))===job.inputSha256&&job.inputSha256===plan.inputSha256,'Actual independent callback approval required');
 const input=read(job.inputFile),report=read(job.rawFile),priorFile=dir+'complete-English-source-prepared-v1/prospective-packet.json';need(hash(fs.readFileSync(priorFile))===plan.sourcePreparationPacketSha256,'Original prospective source changed');const prior=read(priorFile);
 need(same(packet.input,prior.input)&&same(packet.units,prior.units)&&same(input.cases,plan.cases)&&same([...unresolved].sort(),plan.cases.map(c=>c.id).sort()),'Exact independently reviewed source callback set required');
 need(report.kind==='source-callback-reconciliation-review'&&report.packetSha256===job.inputSha256&&report.verdict==='approve'&&report.reviewer.agentId===job.agentId&&report.reviewer.independentOfAuthors===true&&!input.excludedReviewerIds.includes(job.agentId)&&report.checks.length===plan.cases.length&&report.checks.every(c=>c.verdict==='approve')&&!report.findings.length,'Complete independent callback checks required');
 const next=structuredClone(extraction),peopleBefore=structuredClone(next.people),claimsBefore=structuredClone(next.claims),mentionIds=new Set(next.mentions.map(m=>m.id));let ordinal=Math.max(0,...next.mentions.map(m=>Number(m.id.match(/:m(\d+)$/u)?.[1]??NaN)));need(Number.isFinite(ordinal),'Known local mention ID geometry required');
 for(const c of plan.cases){
  const candidate=packet.preflight.candidates.find(p=>p.id===c.id),unit=packet.units.find(u=>u.id===c.sourceUnitId);need(same(candidate,c.candidate)&&unit&&candidate.language==='en'&&same(unit,input.sourceUnits.find(u=>u.id===unit.id)),'Exact source callback witness changed');
  need(!next.candidateDispositions.some(d=>d.candidate===c.id)&&!next.mentions.some(m=>m.candidateRefs.includes(c.id)),'Callback already accounted');
  if(c.proposal.disposition==='not-person'){
   need(['place','collective','polity'].includes(c.proposal.reason)&&c.proposal.note.length>=20,'Specific reviewed non-person meaning required');next.candidateDispositions.push({candidate:c.id,disposition:'not-person',reason:c.proposal.reason,note:c.proposal.note});continue;
  }
  need(c.proposal.disposition==='person','Explicit reviewed callback disposition required');const person=next.people.find(p=>p.localId===c.proposal.person);need(person&&same(person.preferredNameSuggestion,c.existingPerson.preferredNameSuggestion),'Existing local person anchor changed');
  for(const witness of c.sourceMentions){const actual=next.mentions.find(m=>m.id===witness.id);need(actual?.person===person.localId&&actual.unit.id===c.proposal.anchorUnit&&same(actual.spans.zh,witness.spans.zh)&&actual.spans.zh.length,'Existing Chinese local assignment witness changed');}
  need(c.sourceMentions.length>0&&(c.proposal.anchorUnit===unit.id||(unit.id==='s0165'&&c.proposal.anchorUnit==='s0164')),'Explicit reviewed continuing-subject anchor required');
  const id='jinshu:109:m'+String(++ordinal).padStart(4,'0');need(!mentionIds.has(id),'New local mention ID collision');mentionIds.add(id);const span=exactSpanAt(unit.en,candidate.exact,candidate.occurrence);need(span.startCodePoint===candidate.startCodePoint&&span.endCodePoint===candidate.endCodePoint,'Exact new English source geometry required');
  next.mentions.push({id,person:person.localId,unit:Object.fromEntries(['id','kind','blockIndex','collection','itemIndex'].map(k=>[k,unit[k]])),kind:c.proposal.kind,spans:{zh:[],en:[span]},candidateRefs:[c.id]});
 }
 need(same(next.people,peopleBefore)&&same(next.claims,claimsBefore),'Callback repair changed people/claims/dates');need(next.mentions.length===extraction.mentions.length+17&&next.candidateDispositions.length===extraction.candidateDispositions.length+6,'Exactly17 reviewed mentions and6 reviewed non-person dispositions required');return next;
}
