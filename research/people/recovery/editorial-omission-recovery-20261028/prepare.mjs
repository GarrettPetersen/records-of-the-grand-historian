import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {ROOT,REF,load,read,set,overlay} from './canonical-runtime.mjs';
const JOB=path.dirname(fileURLToPath(import.meta.url)),hash=b=>createHash('sha256').update(b).digest('hex'),need=(ok,m)=>{if(!ok)throw Error(m)};
const edits={
 'jinshu/031':{
  s0577:{literal:'The empress went out to tend her mother during her illness for more than ten days. The crown prince often visited the Yicheng residence, bringing physicians in and out and respectfully observing every propriety.',idiomatic:'The empress spent more than ten days away tending her sick mother. The crown prince often visited the Yicheng residence with physicians, behaving respectfully and observing every courtesy.'},
  s0588:{literal:"The empress had a quarrel with Jiong's mother, so Lun sent him.",idiomatic:"The empress had fallen out with Jiong's mother, which was why Lun sent him."},
  s0599:{literal:'Zhao Can, Jia Wu, Han Shou, Dong Meng and the others were all executed.',idiomatic:'Zhao Can, Jia Wu, Han Shou, Dong Meng and the others were all executed.'}},
 'jinshu/053':{s0034:{literal:"Earlier, Empress Jia's mother, Guo Huai, had wanted Han Shou's daughter to become crown princess; the crown prince also wished to marry into the Han family to strengthen his position.",idiomatic:"Earlier, Empress Jia's mother, Guo Huai, had wanted Han Shou's daughter to become crown princess. The crown prince also hoped that marrying into the Han family would strengthen his position."}},
 'zizhitongjian/083':{s0152:{literal:'Mi was then Palace Attendant; when he came to the Eastern Palace the Heir Apparent sometimes dismissed him and played in the rear court.',idiomatic:'Mi was then a Palace Attendant. When he visited the Eastern Palace the heir apparent sometimes dismissed him and amused himself in the rear court.'}},
};
const reason={s0577:'Corrects the actor: the empress tended her sick mother; restores the crown prince’s visits, physicians, duration and respectful observance.',s0588:'Corrects the relationship: the empress had a quarrel with Jiong’s mother; restores why Lun sent Jiong.',s0599:'Restores all four named individuals, the others and explicit execution; removes unsupported compression that they died with the empress.',s0034:'Restores Han Shou’s name, his daughter, Guo Huai’s relationship to Empress Jia, the crown-princess proposal and the crown prince’s motive.',s0152:'Corrects the office 侍中 to Palace Attendant; preserves the existing actions and subjects.'};
const builder=await load('scripts/build-people-extraction-packet.mjs'),candidates=await load('scripts/lib/people-candidates.mjs'),compact=await load('scripts/lib/people-compact.mjs'),validator=await load('scripts/validate-people-extraction.mjs'),editorial=await load('scripts/build-people-editorial-review.mjs');
const matcher=candidates.loadProperNounMatcher();const dossiers=[],scopes=[];
for(const [scope,units]of Object.entries(edits)){
 const[book,chapter]=scope.split('/'),sourceFile=`data/${scope}.json`,extractFile=`data/people/extractions/${scope}.json`,source=read(sourceFile),stored=read(extractFile);
 const packet=builder.buildPeopleExtractionPacket(book,chapter,{chapterData:source,chapterFile:ROOT+'/'+sourceFile,properNounMatcher:matcher});
 const extraction=stored.schemaVersion===2?compact.expandPeopleExtraction(stored,packet):structuredClone(stored);
 validator.validatePeopleExtraction(extraction,packet);
 let number=Math.max(0,...extraction.translationRepairs.map(r=>Number(r.id.match(/r(\d+)$/)?.[1]??0)));
 const added=[];
 for(const[id,fields]of Object.entries(units)){
  const unit=packet.units.find(u=>u.id===id);need(unit,'Missing unit '+scope+':'+id);
  for(const[field,after]of Object.entries(fields)){
   const before=field==='literal'?unit.literal:unit.en;need(before!==after,'No-op repair');
   const matching=extraction.translationRepairs.filter(r=>r.status==='proposed'&&r.unit.id===id&&r.field===field);need(matching.length<=1,'Overlapping pending proposal');
   if(matching.length){matching[0].after=after;matching[0].reason=reason[id];matching[0].confidence='high';added.push(matching[0].id);}
   else{const locator=Object.fromEntries(['id','kind','blockIndex','collection','itemIndex'].map(k=>[k,unit[k]]));const repair={id:`${book}:${chapter}:r${String(++number).padStart(4,'0')}`,unit:locator,field,before,after,reason:reason[id],confidence:'high',status:'proposed'};extraction.translationRepairs.push(repair);added.push(repair.id);}
  }
 }
 validator.validatePeopleExtraction(extraction,packet);
 const dossier=editorial.buildEditorialReviewDossierFromLoaded(book,{chapterId:chapter,packet,extraction},{context:2});
 const blockIndices=new Set(dossier.items.map(i=>packet.units.find(u=>u.id===i.proposal.unit.id).blockIndex));
 dossier.completeGoverningBlocks=[...blockIndices].sort((a,b)=>a-b).map(i=>({blockIndex:i,block:source.content[i]}));
 dossiers.push(dossier);scopes.push({scope,sourceSha256:hash(Buffer.from(JSON.stringify(source))),originalExtractionSha256:hash(Buffer.from(JSON.stringify(stored))),chapterFingerprint:packet.input.chapterFingerprint,newOrUpdatedRepairIds:added,pendingRepairs:dossier.items.length});
 // Draft extraction is a small review artifact; source files remain untouched.
 fs.writeFileSync(path.join(JOB,book+'-'+chapter+'-draft-extraction.json'),JSON.stringify(extraction,null,2)+'\n');
}
const bundle={schemaVersion:1,revision:REF,instructions:'Review all pending proposals once. Existing approved repair history is preserved. Provide complete replacement English for any further concrete omission found in the supplied complete blocks; do not return only a flag. Put extra repairs in additionalRepairs with scope, unitId, field, before, after, reason. They require host validation and independent approval before application.',dossiers};
// Intern repeated people and claims losslessly; retain every complete source block.
for(const dossier of dossiers){
 const people={},claims={};
 for(const item of dossier.items){
  const personIds=[],claimIds=[];
  for(const person of item.relatedPeople){const id=person.localId;need(!people[id]||JSON.stringify(people[id])===JSON.stringify(person),'Conflicting repeated person');people[id]=person;personIds.push(id);}
  for(const claim of item.relatedClaims){const id=claim.id;need(!claims[id]||JSON.stringify(claims[id])===JSON.stringify(claim),'Conflicting repeated claim');claims[id]=claim;claimIds.push(id);}
  item.relatedPeople=personIds;item.relatedClaims=claimIds;
 }
 dossier.relatedPeopleById=people;dossier.relatedClaimsById=claims;
 dossier.encoding='items.relatedPeople and relatedClaims are exact references to the complete records in relatedPeopleById/relatedClaimsById; all complete governing source blocks are retained';
}
const bytes=Buffer.from(JSON.stringify(bundle)+'\n');need(bytes.length<=512*1024,'Oversized editorial evidence after lossless deduplication: split complete chapter scopes, never truncate');fs.writeFileSync(path.join(JOB,'editorial-review-bundle.json'),bytes);fs.writeFileSync(path.join(JOB,'preparation.json'),JSON.stringify({revision:REF,bundleSha256:hash(bytes),bytes:bytes.length,scopes,sourceChanged:false},null,2)+'\n');console.log(JSON.stringify({bundleBytes:bytes.length,bundleSha256:hash(bytes),scopes:scopes.map(({scope,pendingRepairs,newOrUpdatedRepairIds})=>({scope,pendingRepairs,newOrUpdated:newOrUpdatedRepairIds.length}))}));
