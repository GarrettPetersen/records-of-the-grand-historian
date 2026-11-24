import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function peopleLookupEnvironment(env=process.env){
 const url=env.PEOPLE_LOOKUP_URL;
 if(!url)throw Error('PEOPLE_LOOKUP_URL is required; use the verified deployment URL');
 const parsed=new URL(url);
 if(parsed.protocol!=='https:'||parsed.username||parsed.password||parsed.search||parsed.hash||parsed.pathname!=='/')throw Error('Lookup URL must be an HTTPS origin');
 const token=env.PEOPLE_LOOKUP_TOKEN??fs.readFileSync(env.PEOPLE_LOOKUP_TOKEN_FILE??path.join(os.homedir(),'.local/share/24histories-people-lookup/client-token'),'utf8').trim();
 if(!/^[a-f0-9]{64}$/.test(token))throw Error('Invalid people lookup credential');
 return{PEOPLE_LOOKUP_URL:parsed.origin,PEOPLE_LOOKUP_TOKEN:token};
}
// Use as cloud.envVars in Agent.create, or cloud.envVars in agent.send to resume.
// Pass ONLY these two variables, never all of process.env or Cloudflare credentials.
export function peopleLookupCloudOptions(env=process.env){return{envVars:peopleLookupEnvironment(env)};}
export async function peopleLookup(route,env=process.env,fetcher=fetch){
 const config=peopleLookupEnvironment(env);
 if(!route.startsWith('/v1/')||route.startsWith('//'))throw Error('Only relative read-only lookup routes are supported');
 const response=await fetcher(config.PEOPLE_LOOKUP_URL+route,{headers:{authorization:`Bearer ${config.PEOPLE_LOOKUP_TOKEN}`},signal:AbortSignal.timeout(15000),redirect:'error'});
 if(!response.ok)throw Error(`People lookup returned HTTP ${response.status}; do not guess or switch to an unpinned dataset`);
 return response.json();
}
