import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { gitIdentitySnapshot, provePinnedDossierReuse, assertPinnedIdentityRuntime, pinnedIdentityChapterContext } from './lib/people-pinned-identity-source.mjs';
import { peopleDigest } from './lib/people-identity-seal.mjs';
import { contentUnits, sha256 } from './lib/people-content.mjs';
import { dateAuditItems } from './lib/people-date-audit.mjs';

function fixture(t) {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'identity-pinned-test-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const git=(...args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8'}).trim();
 git('init','-q');git('config','user.email','fixture@example.invalid');git('config','user.name','Fixture');
 const write=(file,text)=>{fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),text);};
 const json=(file,value)=>write(file,JSON.stringify(value)+'\n');
 const code=['people-identity-registry-workflow','people-corpus','people-resolution','people-identity-dossiers','people-identity-member-store','people-identity-dossier-store'];
 for(const name of code)write(`scripts/lib/${name}.mjs`,'export const fixture=true;\n');
 write('scripts/lib/people-corpus.mjs',"import {\n fixture\n} from './nested.mjs';\nexport { value } from './reexport.mjs';\nimport { 'quoted' as value } from './quoted.mjs';\n");
 write('scripts/lib/nested.mjs',"import './leaf.mjs';\nexport const fixture=true;\n");write('scripts/lib/leaf.mjs','export const leaf=true;\n');write('scripts/lib/reexport.mjs','export const value=true;\n');write('scripts/lib/quoted.mjs','export const quoted=true;\n');
 json('package.json',{name:'fixture',type:'module',scripts:{test:'old'},dependencies:{ajv:'8'}});json('data/people/config.json',{promptVersion:7});json('data/glossary.json',{});json('data/people/schema/fixture.schema.json',{});
 const source={content:[{sentences:[{id:'s0001',zh:'甲至。',en:'Jia arrived.',literal:'Jia arrived.'}]}]};
 const extraction={schemaVersion:2,book:'fixture',chapter:'001',run:{model:'extractor'},people:[['p001',['Jia','甲'],'historical','Official',{a:[]}]],claims:[]};
 json('data/fixture/001.json',source);json('data/people/extractions/fixture/001.json',extraction);
 const units=contentUnits(source).map(({id,zh,en,literal,blockIndex})=>({id,zh,en,literal,blockIndex})),items=dateAuditItems(extraction);
 const report={schemaVersion:1,auditVersion:1,book:'fixture',chapter:'001',status:'audited',sourceHash:sha256(JSON.stringify(units)),extractionHash:sha256(JSON.stringify(extraction)),reviewedAt:'2026-01-01T00:00:00Z',reviewer:{name:'Independent fixture reviewer',independentOfExtractor:true},summary:'Complete fixture source review without chronological assertions.',reviewedUnits:['s0001'],itemChecks:[{id:'hints-p001',verdict:'supported',event:'Jia arrived in an undated source statement.',reason:'Empty activity hints preserve the genuinely undated source statement.',evidence:[{unit:'s0001',quote:'甲至'}]}],personChecks:[{id:'p001',verdict:'supported',reason:'The source merely records Jia arriving without a date.',evidence:[{unit:'s0001',quote:'甲至'}]}],findings:[],references:[]};
 assert.equal(items.items.length,1);json('data/people/date-audits/fixture/001.json',report);
 const commit=()=>{git('add','.');git('commit','-qm','fixture');return git('rev-parse','HEAD');};
 const base=commit(),snapshot=gitIdentitySnapshot(root,base),provenance={revision:base,identityInputs:snapshot.legacySeal()};
 return {root,git,write,json,commit,base,snapshot,provenance,source,extraction,report};
}

test('original Git seal equals byte hashes of the original filesystem inventory',t=>{
 const f=fixture(t),files=f.git('ls-files').split('\n').filter(p=>!p.startsWith('data/people/date-audits/')).sort();
 const expected=peopleDigest(files.map(p=>[p,createHash('sha256').update(fs.readFileSync(path.join(f.root,p))).digest('hex')]));
 assert.equal(f.snapshot.legacySeal(),expected);assert(f.snapshot.codeDependencies().includes('scripts/lib/leaf.mjs'));assert(f.snapshot.codeDependencies().includes('scripts/lib/reexport.mjs'));assert(f.snapshot.codeDependencies().includes('scripts/lib/quoted.mjs'));
});
test('unrelated code and package script changes reuse immutable dossiers without rewriting seals',t=>{
 const f=fixture(t);f.write('scripts/test-unrelated.mjs','console.log("new test");\n');f.json('package.json',{name:'fixture',type:'module',scripts:{test:'new'},dependencies:{ajv:'8'}});const current=gitIdentitySnapshot(f.root,f.commit());
 const proof=provePinnedDossierReuse(f.provenance,current,{runtimeRoot:f.root,codeRoot:f.root});assert.equal(proof.registryBytesChanged,false);assert.equal(proof.retainedOriginalSeal,f.provenance.identityInputs);assert.equal(proof.sourceRevision,current.revision);assert.equal(proof.chapterApproval,false);
});
test('changed source, extraction, inventories, schema, curation and construction code remain blocked',t=>{
 for(const file of ['data/fixture/001.json','data/people/extractions/fixture/001.json','data/fixture/002.json','data/people/schema/new.schema.json','data/people/curation/new.json','scripts/lib/leaf.mjs','scripts/lib/quoted.mjs']){
  const f=fixture(t);f.write(file,file.endsWith('.mjs')?'export const changed=true;\n':'{}\n');const current=gitIdentitySnapshot(f.root,f.commit());assert.throws(()=>provePinnedDossierReuse(f.provenance,current,{runtimeRoot:f.root,codeRoot:f.root}),/Dossier data changed|construction code changed/);
 }
});
test('package dependency changes and unverifiable original provenance are rejected',t=>{
 const f=fixture(t);assert.throws(()=>provePinnedDossierReuse({...f.provenance,identityInputs:'sha256:bad'},f.snapshot,{runtimeRoot:f.root,codeRoot:f.root}),/original Git source seal/);
 f.json('package.json',{name:'fixture',type:'module',scripts:{test:'old'},dependencies:{ajv:'9'}});const current=gitIdentitySnapshot(f.root,f.commit());assert.throws(()=>provePinnedDossierReuse(f.provenance,current,{runtimeRoot:f.root,codeRoot:f.root}),/package contract changed/);
});
test('dirty runtime dependencies, added schemas and symlinks cannot pass the pinned runtime check',t=>{
 const f=fixture(t);f.write('scripts/lib/leaf.mjs','changed');assert.throws(()=>assertPinnedIdentityRuntime(f.snapshot,f.root,f.root),/Runtime index dependency differs/);f.write('scripts/lib/leaf.mjs','export const leaf=true;\n');f.json('data/people/schema/extra.schema.json',{});assert.throws(()=>assertPinnedIdentityRuntime(f.snapshot,f.root,f.root),/inventory differs/);fs.unlinkSync(path.join(f.root,'data/people/schema/extra.schema.json'));
 const file=path.join(f.root,'data/glossary.json'),saved=path.join(f.root,'saved-glossary');fs.renameSync(file,saved);fs.symlinkSync(saved,file);assert.throws(()=>assertPinnedIdentityRuntime(f.snapshot,f.root,f.root),/regular file/);
});
test('computed index imports and nonregular committed data fail loudly',t=>{
 const f=fixture(t);f.write('scripts/lib/leaf.mjs','export const x=import(variable);\n');const current=gitIdentitySnapshot(f.root,f.commit());assert.throws(()=>current.codeDependencies(),/Computed index dependency/);
 const g=fixture(t);fs.unlinkSync(path.join(g.root,'data/glossary.json'));fs.symlinkSync('people/config.json',path.join(g.root,'data/glossary.json'));const next=gitIdentitySnapshot(g.root,g.commit());assert.throws(()=>next.legacySeal(),/nonregular/);
});
test('pinned chapter pins and independent dates use committed evidence and reject stale or negative reports',t=>{
 const f=fixture(t),context=pinnedIdentityChapterContext(f.root,f.base),before=context.inputs('fixture','001');f.json('data/fixture/001.json',{});assert.deepEqual(context.inputs('fixture','001'),before);assert.equal(context.dates('fixture','001').status,'audited');
 f.json('data/people/date-audits/fixture/001.json',{...f.report,sourceHash:'sha256:bad'});const current=pinnedIdentityChapterContext(f.root,f.commit());assert.throws(()=>current.dates('fixture','001'),/stale/);
 assert.throws(()=>gitIdentitySnapshot(f.root,'HEAD'),/Exact Git commit/);assert.throws(()=>context.inputs('../fixture','001'),/Invalid pinned chapter/);
});
