import {test} from 'node:test';
import assert from 'node:assert/strict';
import {peopleLookupCloudOptions,peopleLookup} from '../../scripts/lib/people-lookup-client.mjs';
const env={PEOPLE_LOOKUP_URL:'https://lookup.example',PEOPLE_LOOKUP_TOKEN:'a'.repeat(64),PRODUCTION_CLOUDFLARE_API_TOKEN:'do-not-transmit'};
test('cloud injection includes only lookup credentials',()=>{
 assert.deepEqual(peopleLookupCloudOptions(env),{envVars:{PEOPLE_LOOKUP_URL:env.PEOPLE_LOOKUP_URL,PEOPLE_LOOKUP_TOKEN:env.PEOPLE_LOOKUP_TOKEN}});
 assert.throws(()=>peopleLookupCloudOptions({...env,PEOPLE_LOOKUP_URL:'http://lookup.example'}));
});
test('client uses header credential and refuses errors or cross-origin route',async()=>{
 let called=false;
 await peopleLookup('/v1/search?q=Cao',env,async(url,opts)=>{
 called=true;assert.equal(url,'https://lookup.example/v1/search?q=Cao');assert.equal(opts.headers.authorization,`Bearer ${env.PEOPLE_LOOKUP_TOKEN}`);assert.equal(opts.redirect,'error');return Response.json({total:1});
 });assert.equal(called,true);
 await assert.rejects(()=>peopleLookup('//evil.example/v1/search',env));
 await assert.rejects(()=>peopleLookup('/v1/manifest',env,async()=>new Response('',{status:429})),/HTTP 429/);
});
