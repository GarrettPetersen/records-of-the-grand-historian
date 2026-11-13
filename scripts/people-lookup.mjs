#!/usr/bin/env node
import {parseArgs} from 'node:util';
import {peopleLookup} from './lib/people-lookup-client.mjs';
import {loadDotenv} from './load-dotenv.mjs';
loadDotenv(process.cwd());
const {values}=parseArgs({options:{name:{type:'string'},key:{type:'string'},person:{type:'string'},member:{type:'string'},manifest:{type:'boolean'}}});
const modes=[values.name!==undefined,values.key!==undefined,values.person!==undefined,Boolean(values.manifest)].filter(Boolean).length;
if(modes!==1||values.member&&!values.person)throw Error('Use exactly one of --name NAME, --key KEY, --person ID [--member LOCAL_ID], --manifest');
const route=values.manifest?'/v1/manifest':values.person?`/v1/people/${encodeURIComponent(values.person)}${values.member?'?'+new URLSearchParams({member:values.member}):''}`:
 '/v1/search?'+new URLSearchParams(values.key?{key:values.key}:{q:values.name});
console.log(JSON.stringify(await peopleLookup(route),null,2));
