import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const J=path.dirname(fileURLToPath(import.meta.url));
const base=await import('./runtime.mjs?compact-baseline'),candidate=await import('./runtime.mjs?compact-candidate');
const old=await base.load('scripts/lib/people-resolution.mjs');
candidate.overlay.set('scripts/lib/people-resolution.mjs',fs.readFileSync(J+'/candidate/scripts/lib/people-resolution.mjs'));
const next=await candidate.load('scripts/lib/people-resolution.mjs');
let seed=1234;const random=n=>{seed=(1664525*seed+1013904223)>>>0;return seed%n;};
const people=n=>new Map(Array.from({length:n},(_,i)=>{const localId=`fixture:001:p${String(i).padStart(5,'0')}`;return[localId,{localId,claims:[]}]}));
let compared=0,held=0;const details=[];
for(let trial=0;trial<3000;trial++){
 const records=people(8),ids=[...records.keys()],docs=[];
 for(let i=0;i<random(10);i++){
  const members=[...new Set(Array.from({length:2+random(3)},()=>ids[random(ids.length)]))];if(members.length<2)continue;
  docs.push({batch:'trial-'+trial+'-'+i,authority:random(3)===0?'curated':'model',decisions:[{decision:['merge','keep-separate','possible-same-as'][random(3)],localPeople:members}]});
 }
 let a,b,ae,be;try{a=old.resolvePeopleClusters(records,docs)}catch(e){ae=e.message}try{b=next.resolvePeopleClusters(records,docs)}catch(e){be=e.message}
 if(Boolean(ae)!==Boolean(be)){details.push({trial,docs,ae,be});break;}
 if(ae){held++;continue;}
 try{assert.deepEqual(b.clusters,a.clusters);assert.deepEqual([...b.keepSeparate].sort(),[...a.keepSeparate].sort());assert.deepEqual([...b.possibleSameAs].sort(),[...a.possibleSameAs].sort());}catch(e){details.push({trial,docs,a,b,error:e.message});break;}
 compared++;
}
if(details.length){fs.writeFileSync(J+'/compact-resolution-mismatch.json',JSON.stringify(details,null,2));throw Error('Compact resolution differs: inspect sealed mismatch artifact');}
const scaling=[];
for(const size of [100,1000,10000]){
 const records=people(size),ids=[...records.keys()];
 for(const decision of ['merge','keep-separate','possible-same-as']){
  const started=performance.now(),result=next.resolveAcceptedPeopleClusters(records,[{batch:'scaling',authority:'model',decisions:[{decision,localPeople:ids}]}]);
  assert.equal(result.metrics.generatedPairs,0);assert.ok(result.metrics.constraintIncidences<=size);scaling.push({size,decision,clusters:result.clusters.length,metrics:result.metrics,ms:performance.now()-started});
 }
}
const receipt={trials:3000,compared,held,semanticsMatch:true,scaling};fs.writeFileSync(J+'/compact-resolution-tests.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
