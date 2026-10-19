// Research-only structural inventory. This is not a validator, a review, or an applier.
// Output goes to stdout; the caller may preserve it only as a research artifact.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const files = {
  source: ['data/jinshu/129.json', 'bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800'],
  extraction: ['data/people/extractions/jinshu/129.json', '91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8'],
  editorial: ['data/people/editorial-decisions/jinshu/129.json', 'ff5170c7fefc5542092c0c7be0955f069c04bc60c642d52868e3fd2a5b3fe4e2'],
  candidate: ['research/people/jinshu129-saturn-disposition-candidate-20261020-incomplete.json', '507b0c22fb43f63401f29ad3684d49e26210e12f15e40cdaee6be4ecb4bcba89'],
  prior: ['research/people/jinshu129-hanping-second-mention-20261020-incomplete.json', '74e2d7077c164cdd9ba833dfaf1591f50dc94fe80e74f939c25f8e901dfd9c79'],
  prePrior: ['research/people/jinshu129-stale-hints-candidate-20261020-incomplete.json', '2947793437381e85fbe6274462dac158f7336d0c785fbe735d90e3aa7b9eb89b'],
};
const values = {};
for (const [name, [path, expected]] of Object.entries(files)) {
  const bytes = readFileSync(path);
  if (sha(bytes) !== expected) throw Error(`Stale input: ${path}`);
  values[name] = JSON.parse(bytes);
}
const {source, extraction, editorial, candidate, prior, prePrior} = values;
if ([candidate,prior,prePrior].some(x=>x.status !== 'research-only-not-approved') || candidate.previousCandidateSha256 !== files.prior[1] || prior.previousCandidateSha256 !== files.prePrior[1]) throw Error('Unrecognized research candidate chain');
for (const name of ['source', 'extraction', 'editorial']) if (!candidate[name] || !prior[name]) throw Error(`Missing ${name}`);

// Equality is structural JSON equality; distinct array order is meaningful.
function canonical(v) {
  if (Array.isArray(v)) return v.map(canonical);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])]));
  return v;
}
const key = v => JSON.stringify(canonical(v));
const equal = (a,b) => key(a) === key(b);
const ptr = (p,k) => `${p}/${String(k).replaceAll('~','~0').replaceAll('/','~1')}`;
// Equal-length arrays are compared positionally. Different-length arrays use
// exact-element LCS; unmatched members are explicit removals/additions, never
// silently interpreted as equivalent records. Bound both old and new indices.
function diff(before, after, path = '', out = []) {
  if (equal(before, after)) return out;
  if (Array.isArray(before) && Array.isArray(after)) {
    if (before.length === after.length) {
      for (let i=0;i<before.length;i++) diff(before[i],after[i],ptr(path,i),out);
      return out;
    }
    const left=before.map(key), right=after.map(key), rows=left.length+1, cols=right.length+1;
    if (rows*cols > 10_000_000) throw Error(`Diff array too large at ${path}`);
    const dp=Array.from({length:rows},()=>new Uint32Array(cols));
    for(let i=left.length-1;i>=0;i--) for(let j=right.length-1;j>=0;j--) dp[i][j]=left[i]===right[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
    let i=0,j=0;
    while(i<left.length || j<right.length) {
      if(i<left.length && j<right.length && left[i]===right[j]) {i++;j++;}
      else if(j<right.length && (i===left.length || dp[i][j+1]>dp[i+1][j])) out.push({op:'add',path,afterIndex:j++,after:after[j-1]});
      else out.push({op:'remove',path,beforeIndex:i++,before:before[i-1]});
    }
    return out;
  }
  if (before && after && typeof before==='object' && typeof after==='object' && !Array.isArray(before) && !Array.isArray(after)) {
    for (const k of [...new Set([...Object.keys(before),...Object.keys(after)])].sort()) {
      if (!(k in before)) out.push({op:'add',path:ptr(path,k),after:after[k]});
      else if (!(k in after)) out.push({op:'remove',path:ptr(path,k),before:before[k]});
      else diff(before[k],after[k],ptr(path,k),out);
    }
    return out;
  }
  out.push({op:'replace',path,before,after});
  return out;
}

// Reproduce compact mention order from source occurrence geometry. This is an
// inventory crosswalk, not proof of source identity, scanner ownership, or
// integrity of arbitrary external references to these positional identifiers.
function mentions(chapter, compact) {
  const units=[];
  for (const block of chapter.content) for (const value of Object.values(block)) {
    if (!Array.isArray(value)) continue;
    for (const item of value) if (item && typeof item.id==='string' && typeof item.zh==='string') units.push(item);
  }
  const index=new Map(units.map((unit,i)=>[unit.id,{unit,i}]));
  if (index.size!==units.length) throw Error('Duplicate source unit');
  const rows=[];
  for(const [person,kind,language,exact,refs] of compact.surfaces) for(const [unitId,occurrences] of refs) for(const occurrence of occurrences) {
    const entry=index.get(unitId); if(!entry) throw Error(`Missing unit ${unitId}`);
    const translations=entry.unit.translations?.filter(t=>t.lang==='en') ?? [];
    if (language==='en' && translations.length!==1) throw Error(`Unexpected English owner ${unitId}`);
    const text=language==='zh'?entry.unit.zh:language==='en'?translations[0].idiomatic:null;
    if(typeof text!=='string' || !exact || !Number.isInteger(occurrence) || occurrence<0) throw Error(`Invalid mention ${unitId}`);
    const chars=[...text], needle=[...exact], matches=[];
    for(let i=0;i<=chars.length-needle.length;i++) if(needle.every((c,j)=>chars[i+j]===c)) matches.push(i);
    const start=matches[occurrence]; if(start===undefined) throw Error(`Stale mention ${unitId} ${exact} ${occurrence}`);
    rows.push({person,kind,language,unit:unitId,exact,occurrence,start,end:start+needle.length,order:entry.i});
  }
  rows.sort((a,b)=>a.order-b.order || a.language.localeCompare(b.language) || a.start-b.start || b.end-a.end || a.person.localeCompare(b.person));
  return rows.map((r,i)=>({id:`jinshu:129:m${String(i+1).padStart(4,'0')}`,...r}));
}
const mentionKey=r=>key([r.person,r.kind,r.language,r.unit,r.exact,r.occurrence]);
function crosswalk(before,after,identity) {
  const left=new Map(), right=new Map();
  for(const row of before) {const k=identity(row); if(!left.has(k)) left.set(k,[]); left.get(k).push(row);}
  for(const row of after) {const k=identity(row); if(!right.has(k)) right.set(k,[]); right.get(k).push(row);}
  const matched=[],removed=[],added=[],ambiguous=[];
  for(const k of [...new Set([...left.keys(),...right.keys()])].sort()) {
    const a=left.get(k)??[],b=right.get(k)??[];
    if(a.length===1 && b.length===1) matched.push({before:a[0].id,after:b[0].id,idChanged:a[0].id!==b[0].id});
    else if(!b.length) removed.push(...a);
    else if(!a.length) added.push(...b);
    else ambiguous.push({before:a,after:b});
  }
  return {matched,removed,added,ambiguous};
}
const oldMentions=mentions(source,extraction), newMentions=mentions(candidate.source,candidate.extraction);
const priorMentions=mentions(prior.source,prior.extraction), prePriorMentions=mentions(prePrior.source,prePrior.extraction);
const lastStep=crosswalk(prePriorMentions,priorMentions,mentionKey);
const reported=prior.mentionChanges;
if(lastStep.ambiguous.length || lastStep.removed.length || lastStep.added.length!==1 || lastStep.matched.filter(x=>x.idChanged).length!==reported.renumberedCount || lastStep.matched.length!==reported.originalCount || priorMentions.length!==reported.newCount) throw Error('Independent mention ordering does not match chained candidate crosswalk');
const expectedShift=reported.renumbered.map(x=>[x.before,x.after]).sort((a,b)=>a[0].localeCompare(b[0]));
const actualShift=lastStep.matched.filter(x=>x.idChanged).map(x=>[x.before,x.after]).sort((a,b)=>a[0].localeCompare(b[0]));
if(!equal(expectedShift,actualShift)) throw Error('Chained candidate mention ID pairs do not match');
if (!equal(priorMentions,newMentions)) throw Error('Saturn disposition candidate unexpectedly changes mentions');
// Expanded IDs include each person's embedded name/role claims first, then
// the separate compact claim rows. Preserve complete values for exact matching.
const claims = compact => {
  const rows=[];
  for(const [person,,,,,names,roles] of compact.people) {
    for(const [value,certainty,evidence] of names) rows.push([person,'name',value,certainty,evidence]);
    for(const [roleId,certainty,evidence] of roles) rows.push([person,'role',{roleId},certainty,evidence]);
  }
  rows.push(...compact.claims);
  return rows.map((claim,i)=>({id:`jinshu:129:c${String(i+1).padStart(4,'0')}`,claim}));
};
if(claims(candidate.extraction).length!==candidate.stats.claims) throw Error('Expanded claim count differs from candidate validator statistics');
const output={
  status:'research-only-not-approved',
  warning:'Structural inventory only: no substantive source review, candidate ownership, provenance completeness, identity, date, editorial closure, or publication approval. Crosswalks match identical stored values only; ambiguity is not resolved. Scanner candidates and unscanned missed names are not enumerated.',
  inputs:Object.fromEntries(Object.entries(files).map(([k,[path,hash]])=>[k,{path,sha256:hash}])),
  scope:'Exact staged source/extraction/editorial history to chained research candidate source/extraction/editorial history.',
  changes:Object.fromEntries(['source','extraction','editorial'].map(name=>[name,diff(values[name],candidate[name])])),
  mentionCrosswalk:crosswalk(oldMentions,newMentions,mentionKey),
  claimCrosswalk:crosswalk(claims(extraction),claims(candidate.extraction),r=>key(r.claim)),
  lastStepMentionOrderingCheck:{originalCount:prePriorMentions.length,newCount:priorMentions.length,renumberedCount:lastStep.matched.filter(x=>x.idChanged).length,added:lastStep.added,saturnCandidateMentionsUnchanged:true},
};
const serialized = `${JSON.stringify(output)}\n`;
if (process.argv.length === 2) process.stdout.write(serialized);
else {
  const part = Number(process.argv[2]);
  if (!Number.isInteger(part) || part < 0) throw Error('Expected a nonnegative output part');
  process.stdout.write([...serialized].slice(part * 30000, (part + 1) * 30000).join(''));
}
