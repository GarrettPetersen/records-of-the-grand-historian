// Independent targeted review. Writes only a new isolated, fingerprint-bound artifact.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildPeopleExtractionPacket} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import {editorialDecisionSeed,validateEditorialDecisions,validateAppliedEditorialDecisions} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';

const root='data/people/generated/jinshu-identity-ref-64521198-20261018';
const src=fs.readFileSync(`${root}/jinshu053-combined-proposed-only-v1-incomplete-20261020/source.json`);
const candidate=fs.readFileSync(`${root}/jinshu053-rong-p056-proposed-v1-incomplete-20261020/candidate.json`);
const history=fs.readFileSync(`${root}/jinshu053-combined-proposed-only-v1-incomplete-20261020/editorial-history.json`);
const sha=x=>createHash('sha256').update(x).digest('hex');
assert.equal(sha(src),'26f2169267b866e9203dd05f902044aa6c7839d7b780bba10ce4a1b0066c7e78');
const chapter=JSON.parse(src), compact=JSON.parse(candidate);
const packet=buildPeopleExtractionPacket('jinshu','053',{chapterData:chapter});
const normalized=validateCompactPeopleExtraction(compact,packet,{strictAliasDispositions:true}).normalized;
validateAppliedEditorialDecisions(JSON.parse(history),normalized);
const document=editorialDecisionSeed(normalized);
assert.equal(document.proposals.length,8);
document.reviewer={kind:'codex',name:'Codex independent editorial reviewer /root/reconcile_review',model:null,agentId:'/root/reconcile_review',runId:null,completedAt:new Date().toISOString()};
const byKey=new Map(document.proposals.map(p=>[`${p.unit.id}:${p.field}`,p]));
const units=new Map(packet.units.map(u=>[u.id,u]));
const details={
 's0063:literal':['revise','Eastern Garrison should retain the office General (鎮東將軍); 肜, 允, and 倫 are personal names, each following a princely title.','大將軍梁王肜、鎮東將軍淮南王允、前將軍東武公澹、趙王倫'],
 's0063:idiomatic':['accept','梁王肜 names Rong, Prince of Liang; Jinshu 038 and the existing independently reviewed source evidence support Sima Rong rather than Sima Tong. The 053 sentence itself does not explicitly provide the surname.','大將軍梁王肜'],
 's0108:literal':['accept','趙王倫 is Lun, Prince of Zhao, whose adviser is Sun Xiu.','說趙王倫謀臣孫秀曰'],
 's0108:idiomatic':['accept','趙王倫 is Lun, Prince of Zhao, whose adviser is Sun Xiu; this targeted correction does not approve unrelated omissions.','說趙王倫謀臣孫秀曰'],
 's0111:literal':['accept','趙王倫 is Lun, Prince of Zhao, to whom Xiu reports; 倫 in the following clause is the same person.','秀言于趙王倫，倫深納焉'],
 's0179:literal':['revise','趙王倫 is Lun, Prince of Zhao; close the English appositive with a comma.','趙王倫行太孫太傅'],
 's0179:idiomatic':['revise','趙王倫 is Lun, Prince of Zhao; close the English appositive with a comma.','趙王倫行太孫太傅'],
 's0183:literal':['revise','趙王倫 is Lun, Prince of Zhao; close the appositive. This targeted name correction does not resolve the later pronoun ambiguity or replace the separate independently reviewed full-field proposal.','趙王倫篡位，廢為濮陽王'],
};
for(const [key,[decision,reason,excerpt]] of Object.entries(details)){
 const p=byKey.get(key); assert(p,key); assert(units.get(p.unit.id).zh.includes(excerpt),key);
 let after=null;
 if(decision==='revise'){
   after=p.after;
   if(key==='s0063:literal') after=after.replace('Eastern Garrison Yun,','Eastern Garrison General Yun,');
   else after=after.replace('Lun, Prince of Zhao ','Lun, Prince of Zhao, ');
   assert.notEqual(after,p.after,key);
 }
 const d=document.decisions.find(x=>x.repairId===p.id); assert(d,key);
 Object.assign(d,{decision,after,reason,sourceWitness:{source:'chapter-text',citation:`jinshu:053:${p.unit.id}`,excerpt}});
}
const checked=validateEditorialDecisions(document,normalized,packet);
assert.equal(checked.reviewedRepairs.length,8);
const output=`${root}/jinshu053-rong-p056-independent-decisions-20261020-incomplete.json`;
fs.writeFileSync(output,`${JSON.stringify(document,null,2)}\n`,{flag:'wx'});
console.log(JSON.stringify({output,sha256:sha(fs.readFileSync(output)),sourceSha256:sha(src),candidateSha256:sha(candidate),historySha256:sha(history),decisions:document.decisions.map(d=>({id:d.repairId,decision:d.decision})),chapterFingerprint:document.input.chapterFingerprint,proposalsFingerprint:document.input.proposalsFingerprint},null,2));
