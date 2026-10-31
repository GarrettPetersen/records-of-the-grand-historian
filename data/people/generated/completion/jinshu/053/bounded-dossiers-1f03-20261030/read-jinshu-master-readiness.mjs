import fs from 'node:fs';import path from 'node:path';import {fileURLToPath}from'node:url';
import{load,read,has,REF,readPins,treeInventorySha256}from'./master-readonly-runtime.mjs';
const J=path.dirname(fileURLToPath(import.meta.url));
const {loadValidatedPeopleChapter}=await load('scripts/lib/people-validated-chapter.mjs');
const {loadProperNounMatcher}=await load('scripts/lib/people-candidates.mjs');
const {dateAuditStatus}=await load('scripts/lib/people-date-audit.mjs');
const {validateAppliedEditorialDecisions}=await load('scripts/lib/people-editorial-decisions.mjs');
const config=read('data/people/config.json'),matcher=loadProperNounMatcher(),rows=[];
for(let number=1;number<=130;number++){
 const chapter=String(number).padStart(3,'0'),row={book:'jinshu',chapter,extracted:has(`data/people/extractions/jinshu/${chapter}.json`),sourceValidated:false,editoriallyClosed:false,people:0,units:0,independentIdentityReport:has(`data/people/identity-reviews/jinshu/${chapter}.json`)};
 if(row.extracted){try{const c=loadValidatedPeopleChapter('jinshu',chapter,{properNounMatcher:matcher});row.promptVersion=c.extraction.run.promptVersion;row.sourceValidated=row.promptVersion===config.promptVersion;row.people=c.localPeople.size;row.units=c.packet.units.length;const f=`data/people/editorial-decisions/jinshu/${chapter}.json`,editorial=has(f)?read(f):null;if(editorial)validateAppliedEditorialDecisions(editorial,c.extraction);row.editoriallyClosed=row.sourceValidated&&!c.extraction.translationRepairs.some(r=>r.status==='proposed')&&(!c.extraction.translationRepairs.some(r=>r.status==='applied')||Boolean(editorial));}catch(error){row.sourceOrEditorialError={name:error.name,message:error.message.slice(0,1000)};}try{row.date=dateAuditStatus('jinshu',chapter);}catch(error){row.date={status:'error',reason:error.message.slice(0,1000)};}}
 rows.push(row);
}
const counts={chapters:130,extracted:rows.filter(r=>r.extracted).length,currentStrictSourceValidated:rows.filter(r=>r.sourceValidated).length,editoriallyClosed:rows.filter(r=>r.editoriallyClosed).length,currentDateApproved:rows.filter(r=>r.date?.status==='audited').length,savedIndependentIdentityReports:rows.filter(r=>r.independentIdentityReport).length};
const candidates=rows.filter(r=>r.sourceValidated&&r.editoriallyClosed&&r.date?.status==='audited'&&r.people>0&&!r.independentIdentityReport).sort((a,b)=>a.people-b.people||a.units-b.units||a.chapter.localeCompare(b.chapter));
const result={schemaVersion:1,revision:REF,scope:'Jinshu existing work, read-only planning, no claims assigned',counts,candidates,rows,treeInventorySha256,readPins:Object.fromEntries(readPins),dataQualificationClaimed:false,publicationClaimed:false,generatedAt:new Date().toISOString()};fs.writeFileSync(J+'/jinshu-master-readiness.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({revision:REF,counts,nextCandidates:candidates.slice(0,5).map(r=>({chapter:r.chapter,people:r.people,units:r.units})),readOnly:true}));
