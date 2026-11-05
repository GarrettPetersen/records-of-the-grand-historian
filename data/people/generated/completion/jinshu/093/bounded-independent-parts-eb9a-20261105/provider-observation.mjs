import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
export function observeProvider(selector){
 const profile=path.join(os.homedir(),'Library/Application Support/Grok Bot/sand-client-persistence'),matches=[];
 for(const name of fs.readdirSync(profile).filter(n=>n.endsWith('.blob'))){
  let doc;try{doc=JSON.parse(fs.readFileSync(path.join(profile,name),'utf8'));}catch(e){if(e instanceof SyntaxError)continue;throw e;}
  let value=doc?.value;if(typeof value==='string'){try{value=JSON.parse(value);}catch(e){if(e instanceof SyntaxError)continue;throw e;}}
  if(!Array.isArray(value?.rows))continue;
  for(const row of value.rows)if(selector(row))matches.push(Object.fromEntries(['id','name','lastMessageId','newestEntryId','lastActivityAt'].map(k=>[k,row[k]])));
 }
 if(matches.length!==1)throw Error('Unique actual provider observation required');
 return matches[0];
}
