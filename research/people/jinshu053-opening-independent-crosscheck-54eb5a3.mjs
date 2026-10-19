// Source-pinned independent editorial disposition. Reads Git objects only.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const root='data/people/generated/jinshu-identity-ref-64521198-20261018/';
const draftBytes=fs.readFileSync(`${root}jinshu053-opening-editorial-draft-54eb5a3-v4.json`);
const draft=JSON.parse(draftBytes), ref='54eb5a3c50281bf71a42464b913f194f56753fd0';
const sourceBytes=execFileSync('git',['show',`${ref}:data/jinshu/053.json`]);
const source=JSON.parse(sourceBytes),units=source.content.flatMap(x=>x.sentences??[]);
const hash=x=>createHash('sha256').update(x).digest('hex');
if(hash(sourceBytes)!==draft.sourceByteSha256)throw Error('Source pin mismatch');
const revisions={
 s0019:'Review whether 斷其鞅勒 explicitly attributes the cutting to the crown prince; the source leaves the subject implicit. Avoid imposing an unsupported actor.',
 s0038:'The violent idiom 魚肉 is translated too literally to convey its force. Consider “make prey of them” or “butcher them,” while retaining the likely Jia-family referent as contextual.',
 s0039:'晏駕 is an established euphemism for a ruler’s death; literal “the imperial carriage is delayed” is misleading without explanation. Translate or gloss the death in both fields.',
 s0048:'Across units s0048–s0054, preserve continuous quotation and the deliberately ambiguous 自了; “bring matters to an end” should not silently assert a specific act.',
 s0049:'Keep this as a continuation of the forged text begun in s0048, not an independent closed quotation; 入 should remain explicit.',
 s0050:'Keep the empress line inside the same forged text, preserving the parallel ambiguous verb and 速.',
 s0051:'The unchanged literal “finish her” makes the killing interpretation explicit. Revise literal as well as idiomatic while preserving 手 and ambiguity.',
 s0052:'並謝妃共要克期而兩發 has an unresolved grammatical addressee/subject. “Consort Xie and I have agreed” may assert an unstated first-person subject; review the syntax and parallel context before acceptance.',
 s0053:'皇天許當 and 三辰 need independent philological/source checking; the proposal “we call on Heaven” adds an explicit speaker action and its permission construction is not yet certain.',
 s0054:'The conditional and the three sacrificial animals are supported; ensure continuous quotation and check that the Northern Lord is consistently identified elsewhere.',
 s0063:'The author already identifies conflict with an existing editorial receipt. Rong and the titles need independent proper-name and office verification and receipt reconciliation before use; do not overwrite the prior approved decision.'
};
const noChangeIssues={
 s0005:'Idiomatic “broke off his greeting” supplies a greeting absent from 乃止; the immediate context supports stopping but does not require that added characterization.',
 s0033:'Both English fields make 不能從 a voluntary refusal or ignoring; consider “could not follow” rather than deciding his intention without context.',
 s0040:'Both English fields use “strike” and “remove” for 早為之所; the precise euphemistic measure should be reviewed rather than automatically accepted as a specific act.',
 s0045:'The idiomatic field omits that Empress Jia was preparing to depose the crown prince (將廢太子).'
};
const rowMap=new Map(draft.rows.map(row=>[row.id,row]));
const holdMap=new Map(draft.holds.map(row=>[row.id,row]));
const noChange=new Set(draft.noProposedChange);
const results=[];
for(let number=1;number<=65;number++){
 const id=`s${String(number).padStart(4,'0')}`,unit=units.find(u=>u.id===id),row=rowMap.get(id),hold=holdMap.get(id);
 if(!unit)throw Error(`Missing ${id}`);
 const english=unit.translations.find(t=>t.lang==='en');
 if(!english)throw Error(`Missing English ${id}`);
 if(row && (row.zh!==unit.zh||row.before.literal!==english.literal||row.before.idiomatic!==english.idiomatic))throw Error(`Stale draft ${id}`);
 if(!row&&!hold&&!noChange.has(id))throw Error(`Unaccounted ${id}`);
 let verdict,note;
 if(revisions[id]){verdict='revise-or-hold';note=revisions[id];}
 else if(noChangeIssues[id]){verdict='additional-repair-needed';note=noChangeIssues[id];}
 else if(hold){verdict='research-hold';note=hold.note;}
 else if(row){verdict='provisionally-supported';note='The proposed changed fields preserve the source meaning on this review; check dialogue punctuation across adjacent units and established name/office conventions.';}
 else {verdict='no-proposal-reviewed';note='No clear source-level defect identified in this limited pass; this is not proof that all nuances or dialogue punctuation are perfect.';}
 results.push({id,verdict,note,changedFields:row?Object.keys(row.after).filter(field=>row.after[field]!==row.before[field]):[]});
}
process.stdout.write(JSON.stringify({ref,sourceSha256:hash(sourceBytes),draftPath:`${root}jinshu053-opening-editorial-draft-54eb5a3-v4.json`,draftSha256:hash(draftBytes),reviewer:'/root/chapter_path',scope:'s0001–s0065',status:'partial independent editorial cross-check; not an applied or whole-chapter approval',results},null,2)+'\n');
