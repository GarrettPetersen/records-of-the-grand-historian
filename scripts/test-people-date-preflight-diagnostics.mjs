import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { unresolvedDateAuditItems, validateDateAuditReport } from './lib/people-date-audit.mjs';
import { dateReviewJobs } from './lib/people-date-workflow.mjs';

const year={era:'AD',year:301,precision:'year'};
const unresolved={sourceDate:{text:'少時'},unresolved:true,unresolvedReason:'The source states childhood without resolving a Western date.'};
const bounded={sourceDate:{text:'即位後'},westernBounds:{onOrAfter:year}};
const undated={undatedSourceAttestation:true,event:'Jia is explicitly present in this undated source passage.'};
function packet(values) {
  return {schemaVersion:1,auditVersion:1,book:'fixture',chapter:'001',sourceHash:'sha256:'+'1'.repeat(64),extractionHash:'sha256:'+'2'.repeat(64),extractor:{model:'fixture-extractor'},
    units:[{id:'s0001',zh:'少時甲在，後為官。',en:'Jia was present as a child and later held office.',blockIndex:0}],
    people:[{id:'p001',names:['Jia','甲'],historicity:'historical',descriptor:'Official',hints:[]}],unitPeople:{s0001:['p001']},
    items:values.map((value,index)=>({id:`claim-${index+1}`,claimIndex:index,personId:'p001',predicate:'attestation',value,certainty:'uncertain',evidence:['s0001']}))};
}
function approved(p) {
  const check=id=>({id,verdict:'supported',event:'Jia is the person whose source-specific chronology is checked.',reason:'This fixture checks the exact source and temporal representation.',evidence:[{unit:'s0001',quote:'少時甲在'}]});
  return {schemaVersion:1,auditVersion:1,book:p.book,chapter:p.chapter,sourceHash:p.sourceHash,extractionHash:p.extractionHash,status:'audited',reviewer:{name:'Independent fixture reviewer',independentOfExtractor:true},reviewedAt:'2026-10-24T00:00:00.000Z',summary:'All fixture source units, date items and people were independently checked.',reviewedUnits:['s0001'],itemChecks:p.items.map(i=>check(i.id)),personChecks:[check('p001')],findings:[],references:[]};
}

test('shared predicate finds item.value.unresolved and nested date contexts without changing the packet',()=>{
  const p=packet([unresolved,{dateContext:unresolved},{value:unresolved},bounded,undated,{unresolved:false}]),before=JSON.stringify(p);
  assert.deepEqual(unresolvedDateAuditItems(p).map(i=>i.id),['claim-1','claim-2','claim-3']);assert.equal(JSON.stringify(p),before);
});
test('legal one-sided bounds and explicit undated attestations remain approvable',()=>{
  for(const value of [bounded,undated]){const p=packet([value]);assert.deepEqual(unresolvedDateAuditItems(p),[]);assert.equal(validateDateAuditReport(approved(p),p).status,'audited');}
});
test('approval still rejects unresolved chronology at every supported nesting level',()=>{
  for(const value of [unresolved,{dateContext:unresolved},{value:unresolved}]){const p=packet([value]);assert.throws(()=>validateDateAuditReport(approved(p),p),/Unresolved chronology cannot be approved/);}
});
test('an honest research-blocked report remains valid',()=>{
  const p=packet([unresolved]),report=approved(p);report.status='research-blocked';report.itemChecks[0].verdict='research-blocked';report.findings=[{items:['claim-1'],problem:'The childhood source leaves a Western conversion unresolved.',action:'Preserve the source and research this conversion before approval.'}];assert.equal(validateDateAuditReport(report,p).status,'research-blocked');
});
test('actual dry-run selector reports complete unresolved IDs and still plans initial independent coverage',()=>{
  const source=fs.readFileSync(fileURLToPath(new URL('./run-people-date-workflow.mjs',import.meta.url)),'utf8'),marker='const selected=targets.slice(0,limit).map(t=>{',start=source.indexOf(marker),end=source.indexOf('});',start);
  assert.ok(start>=0&&end>start,'production dry-run selector anchors must exist');assert.equal(source.indexOf(marker,start+1),-1,'selector must be unambiguous');
  const p=packet([unresolved,{dateContext:unresolved},{value:unresolved},bounded,undated]),before=JSON.stringify(p);
  const select=new Function('buildDateAuditPacket','dateReviewJobs','options','unresolvedDateAuditItems',`return t=>{${source.slice(start+marker.length,end)}}`)(()=>p,dateReviewJobs,{maxUnits:1,maxBytes:64000},unresolvedDateAuditItems);
  const result=select({book:'fixture',chapter:'001'});assert.equal(result.unresolvedDateItems,3);assert.deepEqual(result.unresolvedItemIds,['claim-1','claim-2','claim-3']);assert.equal(result.items,5);assert.equal(result.units,1);assert.ok(result.jobs>0,'initial independent audit remains planned');assert.ok(result.maxJobBytes>0);assert.equal(JSON.stringify(p),before);
});
