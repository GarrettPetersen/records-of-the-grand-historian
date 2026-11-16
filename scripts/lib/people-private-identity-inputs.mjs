import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {buildPeopleExtractionPacket} from '../build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from '../validate-people-extraction.mjs';
import {peopleForExtraction} from './people-validated-chapter.mjs';
import {localNameKeys,explicitIdentityConstraints,resolveAcceptedPeopleClusters} from './people-resolution.mjs';
import {buildIdentityDossierIndex} from './people-identity-dossiers.mjs';
import {buildIdentityDossierDelta,applyIdentityDossierDelta} from './people-identity-dossier-delta.mjs';
import {peopleDigest} from './people-identity-seal.mjs';

const need=(ok,message)=>{if(!ok)throw Error(message);};
const bytesHash=bytes=>'sha256:'+createHash('sha256').update(bytes).digest('hex');
const same=(a,b)=>peopleDigest(a)===peopleDigest(b);
const compare=(a,b)=>a.localeCompare(b,'en');

// Read-only preparation. Pending editorial/date bytes are evidence-envelope
// pins, never approvals. Publication must use the normal current native gates.
export function loadPrivateIdentityCandidate({book,chapter,files,properNounMatcher}){
 need(files&&same(Object.keys(files).sort(),['source','extraction','editorial','dateAudit'].sort()),'Four explicit private identity input files are required');
 const read=()=>Object.fromEntries(Object.entries(files).map(([role,file])=>{
  need(path.isAbsolute(file)&&fs.lstatSync(file).isFile()&&!fs.lstatSync(file).isSymbolicLink(),'Private identity inputs must be absolute regular files');
  return[role,fs.readFileSync(file)];
 }));
 const original=read(),inputs=Object.fromEntries(Object.entries(original).map(([role,bytes])=>[role,bytesHash(bytes)]));
 const source=JSON.parse(original.source),raw=JSON.parse(original.extraction),date=JSON.parse(original.dateAudit);
 need(raw.book===book&&raw.chapter===chapter,'Private extraction scope mismatch');
 const packet=buildPeopleExtractionPacket(book,chapter,{chapterData:source,properNounMatcher});
 const {normalized:extraction}=validateCompactPeopleExtraction(raw,packet,{strictAliasDispositions:true});
 const dateUnits=packet.units.map(({id,zh,en,literal,blockIndex})=>({id,zh,en,literal,blockIndex}));
 need(date.sourceHash===bytesHash(JSON.stringify(dateUnits))&&date.extractionHash===bytesHash(JSON.stringify(raw)),'Private date evidence must describe the exact candidate generation');
 return{own:{raw,packet,extraction,localPeople:peopleForExtraction(extraction)},inputs,
  assertUnchanged(){const current=read();for(const role of Object.keys(files))need(bytesHash(current[role])===inputs[role],'Private identity input changed during preparation: '+role);return inputs;},
  metadata:{kind:'private-candidate-identity-inputs',files,inputs,sourceEditorialApproval:false,chronologyApproval:false,publicationApproval:false}};
}

// This mutates only this disposable, read-only registry reader's in-memory view.
// No registry files, accepted memberships or public records are written.
export function projectPrivateIdentityIndex(index,own,scope,loadPerson){
 const key=scope.book+':'+scope.chapter,ids=[...own.localPeople.keys()].sort(compare);
 const previous=index.chapters.get(key),oldIds=previous?[...previous.values()].flat().sort(compare):[];
 if(oldIds.length){
  need(same(ids,oldIds),'Private person inventory changed; replay native accepted membership before preparing these cases');
  const constraints=explicitIdentityConstraints(own.localPeople);
  for(const pair of constraints.same){const[a,b]=pair.split('\u0000');need(index.localPersonMap.get(a)===index.localPersonMap.get(b),'New same-person membership needs native accepted-membership replay');}
  for(const pair of constraints.different){const[a,b]=pair.split('\u0000');need(index.localPersonMap.get(a)!==index.localPersonMap.get(b),'Concrete accepted false merge requires reconciliation');}
  const people=new Map(own.localPeople);
  for(const canonical of previous.keys())for(const id of index.dossiers.get(canonical).localPeople)if(!people.has(id)){
   const person=loadPerson(id);need(person?.localId===id,'Missing current accepted dossier member '+id);people.set(id,person);
  }
  const delta=buildIdentityDossierDelta(index,people,ids,localNameKeys);
  applyIdentityDossierDelta(index,delta);index.localPeople=people;
  return{kind:'private-retained-membership-projection',members:ids.length,membershipChanges:0,sourceEditorialApproval:false,chronologyApproval:false,publicationApproval:false};
 }
 // A new source record may not silently acquire an existing cross-chapter
 // identity. Same/different relationships within this draft use the native
 // constraint reducer; external positive equivalence requires normal curation.
 for(const person of own.localPeople.values())for(const claim of person.claims)if(claim.predicate==='same-person'&&claim.certainty==='explicit'){
  const other=claim.value?.personId??claim.value?.person;need(own.localPeople.has(other),'External positive identity requires native accepted-membership replay');
 }
 for(const id of ids)need(!index.localPersonMap.has(id),'Private source ID already belongs to the accepted registry');
 const accepted=resolveAcceptedPeopleClusters(own.localPeople),added=buildIdentityDossierIndex(own.localPeople,accepted.clusters,localNameKeys);
 for(const id of added.canonicalByKnownId.keys())need(!index.canonicalByKnownId.has(id),'Private canonical lineage conflicts with the retained registry');
 const previousDossiers=index.dossiers,close=index.close;let closed=false;
 index.dossiers={size:previousDossiers.size+added.dossiers.size,get(id){need(!closed,'Private dossier reader is closed');return added.dossiers.get(id)??previousDossiers.get(id);}};
 index.close=()=>{if(!closed){closed=true;close();}};
 for(const kind of ['dossierVersions','localPersonMap','memberVersions','canonicalByKnownId','chapters'])for(const[k,v]of added[kind]){need(!index[kind].has(k),'Private registry key collision '+kind+':'+k);index[kind].set(k,v);}
 for(const kind of ['postings','englishUnknownPostings'])for(const[k,v]of added[kind]){
  const merged=[...(index[kind].get(k)?.ids??[]),...v.ids].sort(compare);need(new Set(merged).size===merged.length,'Duplicate projected dossier posting');
  index[kind].set(k,{ids:merged,total:merged.length,fingerprint:peopleDigest({key:k,ids:merged})});
 }
 index.localPeople=own.localPeople;
 return{kind:'private-new-member-projection',members:ids.length,proposedDossiers:added.dossiers.size,generatedPairs:0,sourceEditorialApproval:false,chronologyApproval:false,publicationApproval:false};
}
