#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {loadDotenv} from './load-dotenv.mjs';
import {peopleLookup,peopleLookupEnvironment} from './lib/people-lookup-client.mjs';
loadDotenv(process.cwd());
const {values}=parseArgs({options:{export:{type:'string'}}});
if(!values.export)throw Error('--export DIRECTORY is required for the expected snapshot seal');
const plan=JSON.parse(fs.readFileSync(path.join(values.export,'export.json'),'utf8'));
const {PEOPLE_LOOKUP_URL:url}=peopleLookupEnvironment();
assert.equal((await fetch(url+'/v1/manifest',{redirect:'error'})).status,401);
const manifest=await peopleLookup('/v1/manifest');
assert.equal(manifest.generation,plan.manifest.generation);assert.equal(manifest.dossierCount,plan.manifest.dossierCount);
const original=await peopleLookup('/v1/search?'+new URLSearchParams({q:'休祐'}));
const variant=await peopleLookup('/v1/search?'+new URLSearchParams({q:'休佑'}));
assert.deepEqual(original,variant);assert(original.total>0&&original.ids.length>0);
const person=await peopleLookup('/v1/people/'+original.ids[0]);
assert.equal(person.registry,plan.prefix);assert.equal(person.publicationApproval,false);assert.equal(person.identityEvidence.length,0);
const member=await peopleLookup('/v1/people/'+person.id+'?'+new URLSearchParams({member:person.localPeople[0]}));
assert.equal(member.version,person.version);assert.equal(member.identityEvidence[0].localId,person.localPeople[0]);
const report={verifiedAt:new Date().toISOString(),url,registry:plan.prefix,dossiers:manifest.dossierCount,unauthenticatedStatus:401,
 chineseVariantSearch:true,searchTotal:original.total,person:person.id,memberEvidence:true,publicationApproval:false};
fs.writeFileSync(path.join(values.export,'live-verification.json'),JSON.stringify(report,null,2)+'\n',{mode:0o600});
console.log(JSON.stringify(report,null,2));
