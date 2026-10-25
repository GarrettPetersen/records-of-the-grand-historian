import fs from 'node:fs';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root='/Users/garrettpetersen/records-of-the-grand-historian';
const out=path.dirname(new URL(import.meta.url).pathname);
const ref='1b9c1e4262fcd1e5eef069b867e96f4e9d90be59', oldref='fe23b5c8f6aefd758dbd53834819d8fee74213c4';
const graphDir=root+'/data/people/generated/independent-identity-recovery/jinshu053-source106-1b9c1e-20261025';
const previous=root+'/data/people/generated/independent-identity-recovery/jinshu053-remaining-30e2e9-20261025/native-jobs/selected-registry.json';
const graph=JSON.parse(fs.readFileSync(graphDir+'/selected-complete-endpoint-clusters.json'));
const graphPins=JSON.parse(fs.readFileSync(graphDir+'/input-pin-manifest.json'));
const oldRegistry=JSON.parse(fs.readFileSync(previous));
const code=graphPins.runtime, cap=262144;
const sha=b=>createHash('sha256').update(b).digest('hex');
const bytes=x=>Buffer.byteLength(JSON.stringify(x));
const git=a=>execFileSync('git',a,{cwd:root,encoding:'utf8',maxBuffer:128e6});
const list=(r,p)=>git(['ls-tree','-r','--name-only',r,'--',p]).trim().split('\n').filter(x=>x.endsWith('.json'));
const inputPins=new Map();
function batch(r,files){const z=spawnSync('git',['cat-file','--batch'],{cwd:root,input:files.map(p=>r+':'+p+'\n').join(''),maxBuffer:256e6});if(z.status!==0||z.error)throw z.error??Error(z.stderr);let offset=0;return files.map(file=>{const e=z.stdout.indexOf(10,offset),h=z.stdout.subarray(offset,e).toString().split(' '),n=Number(h[2]);if(h.length!==3||!Number.isInteger(n))throw Error('Missing '+file);const b=z.stdout.subarray(e+1,e+1+n);offset=e+n+2;const pin={gitRevision:r,path:file,sha256:sha(b),bytes:b.length};inputPins.set(r+':'+file,pin);return {file,pin,document:JSON.parse(b)};});}
function read(r,p){return batch(r,[p])[0];}
function write(name,value){const b=JSON.stringify(value)+'\n';fs.mkdirSync(path.dirname(out+'/'+name),{recursive:true});fs.writeFileSync(out+'/'+name,b);return{file:name,sha256:sha(b),bytes:Buffer.byteLength(b)};}
for(const p of graphPins.dependencyPins){const loc=p.location==='runtime'?code:graphPins.configRoot; if(sha(fs.readFileSync(loc+'/'+p.path))!==p.sha256)throw Error('Dependency drift '+p.path);}
if(process.env.PEOPLE_REPO_ROOT!==graphPins.configRoot)throw Error('Wrong configured repo');
const {buildPeopleExtractionPacket}=await import(code+'/scripts/build-people-extraction-packet.mjs');
const {expandPeopleExtraction}=await import(code+'/scripts/lib/people-compact.mjs');
const {loadProperNounMatcher}=await import(code+'/scripts/lib/people-candidates.mjs');
const {buildResolutionCandidates,resolvePeopleClusters}=await import(code+'/scripts/lib/people-resolution.mjs');
const matcher=loadProperNounMatcher();
const currentDocs=batch(ref,list(ref,'data/people/resolutions'));
const oldDocs=batch(oldref,list(oldref,'data/people/resolutions'));
const archive=read('c423027ff959a09a036da23b46b77da20dc2d51d','research/people/recovery/source106-20261025/whole-decision-invalidations.json').document;
const approvedPaths=new Set(JSON.parse(fs.readFileSync(out+'/inventory.json')).archivedWholeDecisionInventory.filter(x=>x.receiptBacked20261025).map(x=>x.path));
const reviewed=archive.invalidations.filter(x=>approvedPaths.has(x.path));
const receiptNames=['jinshu053-native-identity-review-20261025.json','jinshu053-next-identity-review-20261025.json','jinshu053-wangyan101-review-20261025.json','jinshu053-native-campaign-reviewed-001-006-20261025.json'];
const receiptDocs=receiptNames.map(n=>read(ref,'research/people/'+n));
const proposals=reviewed.flatMap(x=>x.removedDecisions.map((d,n)=>({oldPath:x.path,archiveOrdinal:n,decision:d,decisionContentSha256:sha(JSON.stringify(d,Object.keys(d).sort()))})));
const allExplicit=[];const explicitScan=[];
const extractionPaths=list(ref,'data/people/extractions');
const scanCache=out+'/explicit-identity-reference-recovery.json';
if(fs.existsSync(scanCache)){const c=JSON.parse(fs.readFileSync(scanCache));if(c.canonicalRevision!==ref)throw Error('Stale explicit reference proof');allExplicit.push(...c.explicitClaims);explicitScan.push(...c.extractionPins);}else{
 const search=git(['grep','-l','-e','same-person','-e','different-person',ref,'--','data/people/extractions']).trim().split('\n').filter(Boolean).map(p=>p.slice(ref.length+1));
 for(let i=0;i<search.length;i+=40)for(const x of batch(ref,search.slice(i,i+40))){const ex=x.document,ns=ex.book+':'+ex.chapter;for(const c of ex.claims){const q=Array.isArray(c)?{subject:ns+':'+c[0],predicate:c[1],value:c[2],certainty:c[3]}:c;if(!['same-person','different-person'].includes(q.predicate))continue;let target=q.value?.personId??q.value?.person;if(target&&target.startsWith('p')&&!target.includes(':'))target=ns+':'+target;if(target)allExplicit.push({...q,target,extractionPath:x.file});}}
 explicitScan.push(...graphPins.inputPins.filter(p=>p.path.startsWith('data/people/extractions/')).map(p=>({gitRevision:ref,...p})));
 write('explicit-identity-reference-recovery.json',{canonicalRevision:ref,status:'Narrow Git predicate-token search recovery after unpersisted original2050scan was lost; no second whole extraction materialization scan',searchedExtractionCount:extractionPaths.length,matchingFilesRead:search.length,explicitClaims:allExplicit,extractionPins:explicitScan});
}
const mergeEdges=currentDocs.flatMap(x=>x.document.decisions.filter(d=>d.decision==='merge').map(d=>d.localPeople));
mergeEdges.push(...allExplicit.filter(c=>c.predicate==='same-person'&&c.certainty==='explicit').map(c=>[c.subject,c.target]));
function closure(seed,edges){const set=new Set(seed);let change=true;while(change){change=false;for(const e of edges)if(e.some(i=>set.has(i)))for(const id of e)if(!set.has(id)){set.add(id);change=true;}}return set;}
const historicalGuo=closure(['jinshu:053:p033','jinshu:053:p056'],oldDocs.flatMap(x=>x.document.decisions.filter(d=>d.decision==='merge').map(d=>d.localPeople)));
// Full source reference closure, separate from interpreting the asserted merge intent.
let owned=closure([...Object.keys(graph.localToCanonical),...proposals.flatMap(p=>p.decision.localPeople),...historicalGuo,'jinshu:053:p056'],mergeEdges);
const constraintRows=currentDocs.flatMap(x=>x.document.decisions.map((decision,index)=>({path:x.file,documentSha256:x.pin.sha256,batch:x.document.batch,authority:x.document.authority??'model',decisionIndex:index,decision}))).filter(x=>x.decision.localPeople.some(i=>owned.has(i)));
const validationPeople=closure([...owned,...constraintRows.flatMap(x=>x.decision.localPeople)],mergeEdges);
const selectedChapters=new Set([...validationPeople].map(i=>i.split(':').slice(0,2).join(':')));
selectedChapters.add('jinshu:040');
const people=new Map(),units={},blocks={},chapterPins={},chapterFraming={},inboundClaims={};
const reuseDiagnostics=[];
const idsByChapter=new Map();for(const id of validationPeople){const key=id.split(':').slice(0,2).join(':');if(!idsByChapter.has(key))idsByChapter.set(key,new Set());idsByChapter.get(key).add(id);}
const earlyMembers=closure([...historicalGuo,'jinshu:053:p057','zizhitongjian:083:p070'],mergeEdges);
const earlyChapters=new Set([...earlyMembers].map(i=>i.split(':').slice(0,2).join(':')));earlyChapters.add('jinshu:040');
const orderedChapters=[...earlyChapters].sort().concat([...selectedChapters].filter(c=>!earlyChapters.has(c)).sort());
for(const key of orderedChapters){
 const [book,chapter]=key.split(':'),sp='data/'+book+'/'+chapter+'.json',ep='data/people/extractions/'+book+'/'+chapter+'.json';
 const witnessOnly=key==='jinshu:040'&&!idsByChapter.has(key);if(!witnessOnly&&!extractionPaths.includes(ep))throw Error('Missing actual owned extraction '+ep);
 const rows=batch(ref,witnessOnly?[sp]:[sp,ep]),s=rows[0],e=rows[1],packet=buildPeopleExtractionPacket(book,chapter,{chapterData:s.document,chapterFile:root+'/'+sp,properNounMatcher:matcher});
 const ex=witnessOnly?{people:[],claims:[],mentions:[],input:null}:e.document.schemaVersion===2?expandPeopleExtraction(e.document,packet):e.document;
 chapterPins[key]={source:s.pin,extraction:witnessOnly?null:e.pin,input:ex.input,...(witnessOnly?{kind:'source-witness',ownedRecordCount:0}: {})};
 const old=oldRegistry.chapterPins[key];if(old)reuseDiagnostics.push({chapter:key,sourceBytesUnchanged:old.sourceRawSha256===s.pin.sha256,extractionBytesUnchanged:!witnessOnly&&old.extractionRawSha256===e.pin.sha256});
 const wanted=idsByChapter.get(key)??new Set(),claimsBy=new Map(),mentionsBy=new Map();
 for(const c of ex.claims){if(!claimsBy.has(c.subject))claimsBy.set(c.subject,[]);claimsBy.get(c.subject).push(c);const target=c.value?.personId??c.value?.person;if(target&&wanted.has(target)){if(!inboundClaims[target])inboundClaims[target]=[];inboundClaims[target].push(c);}}
 for(const m of ex.mentions){if(!mentionsBy.has(m.person))mentionsBy.set(m.person,[]);mentionsBy.get(m.person).push(m);}
 const selectedBlocks=new Set();
 for(const p of ex.people)if(wanted.has(p.localId)){
  const claims=claimsBy.get(p.localId)??[],mentions=mentionsBy.get(p.localId)??[];
  const evidence=new Set([...claims.flatMap(c=>c.evidence),...mentions.map(m=>key+':'+m.unit.id)]);
  const unitRefs=[];for(const id of evidence){const short=id.startsWith(key+':')?id.slice(key.length+1):id;const unit=packet.units.find(u=>u.id===short);if(!unit)throw Error('Missing evidence '+id);unitRefs.push(key+':'+short);selectedBlocks.add(unit.blockIndex);}
  people.set(p.localId,{...p,book,chapter,promptVersion:ex.run.promptVersion,claims,mentions,sourceUnitRefs:unitRefs.sort(),chapterPinRef:key});
 }
 // Full governing paragraphs/cells, every source header, and full chapter opening frame.
 if(selectedBlocks.size||key==='jinshu:040')selectedBlocks.add(0);
 if(key==='jinshu:040'){const witness=packet.units.find(u=>u.id==='s0172');if(!witness)throw Error('Missing witness');selectedBlocks.add(witness.blockIndex);}
 s.document.content.forEach((b,i)=>{if(/header|heading|title/.test(b.type??''))selectedBlocks.add(i);});
 chapterFraming[key]={meta:{book:s.document.meta.book,chapter:s.document.meta.chapter,title:s.document.meta.title,url:s.document.meta.url},blockOrder:s.document.content.map((b,i)=>({blockIndex:i,...Object.fromEntries(Object.entries(b).filter(([k])=>!['sentences','cells'].includes(k)))})),availableGoverningBlockRefs:[...selectedBlocks].sort((a,b)=>a-b).map(i=>key+':block:'+i)};
 for(const bi of selectedBlocks){const rawBlock=s.document.content[bi];const skel={...rawBlock};for(const collection of ['sentences','cells'])if(Array.isArray(rawBlock[collection]))skel[collection]=rawBlock[collection].map(u=>({unitRef:key+':'+u.id}));blocks[key+':block:'+bi]={chapterPinRef:key,blockIndex:bi,structure:skel,unitRefs:packet.units.filter(u=>u.blockIndex===bi).map(u=>key+':'+u.id)};for(const u of packet.units.filter(u=>u.blockIndex===bi))units[key+':'+u.id]={id:key+':'+u.id,kind:u.kind,blockIndex:u.blockIndex,collection:u.collection,itemIndex:u.itemIndex,zh:u.zh,en:u.en,literal:u.literal,source:u.source};}
 if(Object.keys(chapterPins).length===earlyChapters.size){
  const earlyPeople=new Map([...people].filter(([id])=>earlyMembers.has(id)));for(const id of earlyMembers)if(!earlyPeople.has(id))throw Error('Missing early source '+id);
  const earlyDocs=currentDocs.map(x=>({...x.document,decisions:x.document.decisions.filter(d=>d.localPeople.every(i=>earlyMembers.has(i)))})).filter(d=>d.decisions.length),rr=resolvePeopleClusters(earlyPeople,earlyDocs),bb=new Map(rr.clusters.flatMap(c=>c.localPeople.map(i=>[i,c.canonicalPersonId]))),aa=buildResolutionCandidates(earlyPeople).people;
  for(const [id,p]of earlyPeople){p.currentCanonicalPersonId=bb.get(id);p.aliasesAndNameKeys=aa[id].nameKeys;p.inboundClaims=inboundClaims[id]??[];p.governingBlockRefs=[...new Set(p.sourceUnitRefs.map(u=>u.split(':').slice(0,2).join(':')+':block:'+units[u].blockIndex))];if(graph.localToCanonical[id]&&graph.localToCanonical[id]!==bb.get(id))throw Error('Early graph mismatch '+id);}
  const earlyConstraint=currentDocs.flatMap(x=>x.document.decisions.map((decision,index)=>({path:x.file,documentSha256:x.pin.sha256,batch:x.document.batch,authority:x.document.authority??'model',decisionIndex:index,decision}))).filter(c=>c.decision.localPeople.some(i=>earlyMembers.has(i)));
  write('p033-p056-component-proof.json',{canonicalRevision:ref,allCurrentResolutionDocumentsScanned:currentDocs.length,currentResolutionReferences:currentDocs.flatMap(x=>x.document.decisions.map((decision,index)=>({path:x.file,index,decision}))).filter(x=>x.decision.localPeople.includes('jinshu:053:p056')),allCurrentExtractionsCoveredByPredicateSearch:explicitScan.length,p056ExplicitIdentityClaims:allExplicit.filter(c=>c.subject==='jinshu:053:p056'||c.target==='jinshu:053:p056'),p056CurrentComponent:rr.clusters.find(c=>c.localPeople.includes('jinshu:053:p056')),historicalRevision:oldref,historicalGuoMemberIds:[...historicalGuo].sort(),currentHistoricalGuoComponents:rr.clusters.filter(c=>c.localPeople.some(i=>historicalGuo.has(i))),witness:{chapter:'jinshu:040',unit:'jinshu:040:s0172',sourcePin:chapterPins['jinshu:040'].source},explicitReferenceProof:'explicit-identity-reference-recovery.json',scope:'Exact current merge-closed early subgraph; no identity verdict or restoration'});
  const partial={schemaVersion:1,artifactKind:'partial-current-derived-lossless-source-registry',canonicalRevision:ref,status:'Explicitly scoped Guo and native-s01 source-complete subset; full1961endpoint registry materialization continuing',people:Object.fromEntries(earlyPeople),units,blocks,chapterFraming,chapterPins,completeCurrentClusters:rr.clusters.map(c=>({canonicalPersonId:c.canonicalPersonId,localPeople:c.localPeople})),currentPriorConstraints:earlyConstraint,fullStructuralBaseline:{gitRevision:ref,resolutionDocuments:currentDocs.map(x=>x.pin)},counts:{records:earlyPeople.size,units:Object.keys(units).length,chapters:Object.keys(chapterPins).length,full1961EndpointRegistryComplete:false,missingFullRegistryMembers:Object.keys(graph.localToCanonical).filter(i=>!earlyPeople.has(i))}};
  console.log(JSON.stringify({stage:'early-source-registry-sealed',pin:write('guo-first-source-registry.json',partial)}));
 }
 if(Object.keys(chapterPins).length%100===0)console.log(JSON.stringify({stage:'source-materialization',chapters:Object.keys(chapterPins).length,records:people.size,units:Object.keys(units).length}));
}
for(const id of validationPeople)if(!people.has(id))throw Error('Missing required person '+id);
const aliases=buildResolutionCandidates(people).people;
for(const [id,p] of people){p.aliasesAndNameKeys=aliases[id].nameKeys;p.inboundClaims=inboundClaims[id]??[];p.governingBlockRefs=[...new Set(p.sourceUnitRefs.map(id=>id.split(':').slice(0,2).join(':')+':block:'+units[id].blockIndex))];}
const selectedDocs=currentDocs.map(x=>({...x.document,decisions:x.document.decisions.filter(d=>d.localPeople.every(i=>validationPeople.has(i)))})).filter(d=>d.decisions.length);
const resolved=resolvePeopleClusters(people,selectedDocs),byLocal=new Map(resolved.clusters.flatMap(c=>c.localPeople.map(i=>[i,c.canonicalPersonId]))),clusters=new Map(resolved.clusters.map(c=>[c.canonicalPersonId,c.localPeople]));
for(const [id,c]of Object.entries(graph.localToCanonical))if(byLocal.get(id)!==c)throw Error('Current complete graph mapping mismatch '+id);
const p056Refs=currentDocs.flatMap(x=>x.document.decisions.map((d,index)=>({path:x.file,index,decision:d}))).filter(x=>x.decision.localPeople.includes('jinshu:053:p056'));
const p056Explicit=allExplicit.filter(c=>c.subject==='jinshu:053:p056'||c.target==='jinshu:053:p056');
const guoCurrent=[...new Set([...historicalGuo].map(i=>byLocal.get(i)))].map(id=>({canonicalPersonId:id,localPeople:clusters.get(id)}));
write('p033-p056-component-proof.json',{canonicalRevision:ref,allCurrentResolutionDocumentsScanned:currentDocs.length,currentResolutionReferences:p056Refs,allCurrentExtractionsScanned:explicitScan.length,p056ExplicitIdentityClaims:p056Explicit,p056CurrentComponent:{canonicalPersonId:byLocal.get('jinshu:053:p056'),localPeople:clusters.get(byLocal.get('jinshu:053:p056'))},historicalRevision:oldref,historicalGuoMemberIds:[...historicalGuo].sort(),currentHistoricalGuoComponents:guoCurrent,resolver:'Exact graph-pinned runtime resolvePeopleClusters over merge-closed selected current subgraph; all1961 global endpoint mappings match',explicitIdentityScanPins:explicitScan,witness:{chapter:'jinshu:040',unit:'jinshu:040:s0172',sourcePin:chapterPins['jinshu:040'].source}});
for(const [id,p]of people)p.currentCanonicalPersonId=byLocal.get(id);
const registry={schemaVersion:1,artifactKind:'current-derived-lossless-selected-source-registry',canonicalRevision:ref,status:'evidence only; no renewed identity approval',people:Object.fromEntries(people),units,blocks,chapterFraming,chapterPins,completeCurrentClusters:[...clusters].map(([canonicalPersonId,localPeople])=>({canonicalPersonId,localPeople})),ownedLocalPeople:[...owned].sort(),validationOnlyLocalPeople:[...validationPeople].filter(i=>!owned.has(i)).sort(),currentPriorConstraints:constraintRows,fullStructuralBaseline:{gitRevision:ref,resolutionDocuments:currentDocs.map(x=>x.pin),allCurrent256DocumentsMustBeReadFromPinnedGitForHostValidation:true},previousEvidence:{registryPath:previous,sha256:sha(fs.readFileSync(previous)),reuseDiagnostics,policy:'Current objects rederived from pinned Git; old approvals remain historical. Full governing blocks newly materialized.'},counts:{currentGraphEndpointMembers:1961,ownedRecords:owned.size,validationRecords:validationPeople.size,records:people.size,units:Object.keys(units).length,blocks:Object.keys(blocks).length,chapters:Object.keys(chapterPins).length,currentPriorConstraintDecisions:constraintRows.length}};
const registryPin=write('source-registry.json',registry);
write('source-registry-input-pins.json',{canonicalRevision:ref,registry:registryPin,graphArtifacts:['selected-complete-endpoint-clusters.json','selected-current-blocks.json','input-pin-manifest.json','graph-summary.json'].map(n=>({path:graphDir+'/'+n,sha256:sha(fs.readFileSync(graphDir+'/'+n))})),inputPins:[...inputPins.values()],dependencyPins:graphPins.dependencyPins,receiptPins:receiptDocs.map(x=>x.pin)});
console.log(JSON.stringify({stage:'registry-sealed',registry:registryPin,counts:registry.counts,p056:clusters.get(byLocal.get('jinshu:053:p056')),historicalGuo:[...historicalGuo]}));
write('preparation-state.json',{registry:registryPin,counts:registry.counts,ownedLocalPeople:[...owned].sort(),status:'registry sealed; packet preparation follows',proposalCount:proposals.length});
