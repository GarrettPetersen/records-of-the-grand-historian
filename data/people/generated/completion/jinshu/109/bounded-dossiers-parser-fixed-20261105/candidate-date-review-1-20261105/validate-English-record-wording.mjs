import {buildPeopleExtractionPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import {loadProperNounMatcher} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-candidates.mjs';
import {validateCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
import {validateAppliedEditorialDecisions} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
const need=(v,m)=>{if(!v)throw Error(m)},same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
// Proposal admission only: validate a private clone, never write source/extraction or grant approval.
export function validateRecordWordingProposals({corrections,input,canonical,source,editorial,root}){
  const proposed=structuredClone(canonical),owned=new Set(input.ownedUnits),units=new Map(input.sourceUnits.map(u=>[u.id,u])),targets=new Set();
  for(const c of corrections){
    const u=units.get(c.unit),target=JSON.stringify([c.recordKind,c.recordId,c.fieldPath]);
    need(u&&owned.has(c.unit)&&c.sourceQuote===u.zh&&c.sourceReason?.trim().length>=20&&Array.isArray(c.fieldPath)&&typeof c.before==='string'&&typeof c.after==='string'&&c.after.trim().length>0&&c.before!==c.after,'Complete record wording proposal required');
    need(!targets.has(target),'Duplicate record wording target');targets.add(target);
    let object,path;
    if(c.recordKind==='claim-label'){
      const hint=input.localClaimLabelHints.find(h=>h.id===c.recordId),allowed=[[2,'label','en'],[2,'en'],[2,'relation'],[2,'action']];
      need(hint&&hint.row[4].includes(c.unit)&&allowed.some(p=>same(p,c.fieldPath))&&c.fieldPath.reduce((v,k)=>v?.[k],hint.row)===c.before,'Only exact supplied claim English wording may change');
      const indices=canonical.claims.flatMap((row,i)=>same(row,hint.row)?[i]:[]);
      need(indices.length===1,'Supplied full claim must match exactly one current canonical row');
      object=proposed.claims[indices[0]];path=c.fieldPath;
    }else{
      const hint=input.localPersonLabelHints.find(h=>h.id===c.recordId),matches=proposed.people.filter(p=>p[0]===c.recordId);
      need(c.recordKind==='person-label'&&hint&&same(c.fieldPath,[0])&&hint.preferredLabels[0]===c.before&&matches.length===1&&same(matches[0][1],hint.preferredLabels),'Only exact supplied preferred English label may change');
      object=matches[0][1];path=c.fieldPath;
    }
    const parent=path.slice(0,-1).reduce((v,k)=>v[k],object);parent[path.at(-1)]=c.after;
  }
  if(corrections.length){
    const packet=buildPeopleExtractionPacket('jinshu','109',{chapterData:source,chapterFile:root+'/data/jinshu/109.json',properNounMatcher:loadProperNounMatcher()});
    const valid=validateCompactPeopleExtraction(proposed,packet,{strictAliasDispositions:true});
    validateAppliedEditorialDecisions(editorial,valid.normalized);
  }
  return {proposals:corrections.length,canonicalWrites:0,independentReviewRequired:true};
}
