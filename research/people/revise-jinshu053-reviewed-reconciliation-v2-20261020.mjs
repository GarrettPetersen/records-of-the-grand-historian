// Isolated review corrections: retain v1 verbatim and write a new incomplete draft.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildPeopleExtractionPacket} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import {validatePeopleExtraction} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import {validateAppliedEditorialDecisions} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
import {buildEditorialReviewDossierFromLoaded} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-editorial-review.mjs';

const root='data/people/generated/jinshu-identity-ref-64521198-20261018';
const base=`${root}/jinshu053-source-reviewed-reconciliation-v1-incomplete-20261020`;
const out=`${root}/jinshu053-source-reviewed-reconciliation-v2-incomplete-20261020`;
const hash=b=>createHash('sha256').update(b).digest('hex');
const expected={'source.json':'a810ace8d38f97313800c968c6858373dc08c98ef08440dfa56e6907a9bd950c','reconciled-extraction.json':'e24fd711cd49c6d76efc588b9a3af7a791209dd709da36b8d0e6d117f57a893d','proposed-extraction.json':'247534d43ae22e586a40e3416919c388d7be9929ec22e5a1dc5025260339581c','editorial-history.json':'30b09ad788522860bd04293c199a03e7f388569ec15314eb53ee2ac8de08a767'};
const contents=Object.fromEntries(Object.entries(expected).map(([n,h])=>{const b=fs.readFileSync(`${base}/${n}`);assert.equal(hash(b),h,n);return [n,b]}));
const source=JSON.parse(contents['source.json']);const history=JSON.parse(contents['editorial-history.json']);
const packet=buildPeopleExtractionPacket('jinshu','053',{chapterData:source});
assert.equal(packet.input.chapterFingerprint,'sha256:40fa800060e3025f9b63ce7a3b201609c9d7797353e3344ef34814443646172e');
const correctionRows=[
 ['523e02b466ec9f5f','other','Heaven in 天子氣 is a component of the imperial aura, not a named person or a deity claim.'],
 ['852bfc6c8ad0e262','collective','All under Heaven refers to the realm or its populace collectively, not a named person or a deity claim.'],
 ['105b2fe617db5013','other','Heaven in 天挺 is a cosmological attribution, not a named person or a deity claim.']
];
function revise(x){
 for(const [suffix,reason,note] of correctionRows){const id=`jinshu:053:cand_${suffix}`;const matches=x.candidateDispositions.filter(d=>d.candidate===id);assert.equal(matches.length,1,id);const d=matches[0];assert.equal(d.disposition,'not-person');assert.equal(d.reason,'deity');d.reason=reason;d.note=note;}
 const id='jinshu:053:cand_e52f72d263aa7470';const matches=x.mentions.filter(m=>m.candidateRefs.includes(id));assert.equal(matches.length,1,id);const m=matches[0];assert.equal(m.person,'jinshu:053:p001');assert.equal(m.kind,'personal-name');m.kind='title-reference';
 return x;
}
const revised=revise(JSON.parse(contents['reconciled-extraction.json']));
const proposed=revise(JSON.parse(contents['proposed-extraction.json']));
const rv=validatePeopleExtraction(revised,packet,{strictAliasDispositions:true});
const pv=validatePeopleExtraction(proposed,packet,{strictAliasDispositions:true});
validateAppliedEditorialDecisions(history,rv.normalized);validateAppliedEditorialDecisions(history,pv.normalized);
const dossier=buildEditorialReviewDossierFromLoaded('jinshu',{chapterId:'053',packet,extraction:pv.normalized},{context:2});
assert.equal(dossier.items.length,7);assert.equal(dossier.decisionSeed.decisions.length,7);assert(dossier.decisionSeed.decisions.every(d=>d.reason===''&&d.sourceWitness===null));
assert(!fs.existsSync(out),'Refusing existing destination');fs.mkdirSync(out);
const outputs={'source.json':contents['source.json'],'reconciled-extraction.json':Buffer.from(`${JSON.stringify(rv.normalized,null,2)}\n`),'editorial-history.json':contents['editorial-history.json'],'proposed-extraction.json':Buffer.from(`${JSON.stringify(pv.normalized,null,2)}\n`),'dossier.json':Buffer.from(`${JSON.stringify(dossier,null,2)}\n`),'blank-decision-seed.json':Buffer.from(`${JSON.stringify(dossier.decisionSeed,null,2)}\n`)};
for(const [n,b] of Object.entries(outputs))fs.writeFileSync(`${out}/${n}`,b,{flag:'wx'});
const manifest={status:'INCOMPLETE research-only materialization; not canonical or publication approval',inputSha256:expected,outputSha256:Object.fromEntries(Object.entries(outputs).map(([n,b])=>[n,hash(b)])),chapterFingerprint:packet.input.chapterFingerprint,proposalFingerprint:dossier.decisionSeed.input.proposalsFingerprint,changes:'Three non-person dispositions corrected to contextual meanings without implying deities; Crown Prince mention is a title-reference, not personal-name. The independent reviews and reviewer-identified v1 errors are retained; no other substantive changes.',stats:rv.stats,remaining:'Seven-proposal decision seed remains blank; unresolved source lacuna, c0106 and Rong claims, s0017 child identification, broader editorial defects, downstream reconciliation after edits, independent date and identity audits, current production schema and publication gates remain open.',validator:'isolated staging-pinned fixture only'};
fs.writeFileSync(`${out}/manifest.json`,`${JSON.stringify(manifest,null,2)}\n`,{flag:'wx'});console.log(JSON.stringify({out,...manifest},null,2));
