#!/usr/bin/env node
import fs from 'node:fs';
const [configFile,tool,argsFile]=process.argv.slice(2);
if(!configFile||!(/^(chapter_[a-z_]+|people_search|people_dossier|people_source_units|list_tools)$/.test(tool??'')))throw Error('Usage: node chapter-client.mjs CONFIG_FILE chapter_TOOL [ARGS_JSON_FILE]');
const config=JSON.parse(fs.readFileSync(configFile,'utf8'));
const url=new URL(config.url);if(url.protocol!=='https:'||url.hostname!=='grokbot-mcp.24histories.com')throw Error('Untrusted chapter endpoint');
const headers={authorization:'Bearer '+config.token,'content-type':'application/json',accept:'application/json, text/event-stream'};
async function call(body){const response=await fetch(url,{method:'POST',headers,body:JSON.stringify(body),redirect:'error',signal:AbortSignal.timeout(90000)});if(!response.ok)throw Error('Chapter service HTTP '+response.status);if(response.status===202)return;const text=await response.text();const data=text.split('\n').filter(s=>s.startsWith('data:')).at(-1);const j=JSON.parse(data?data.slice(5):text);if(j.error)throw Error(j.error.message);return j.result;}
await call({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-06-18',capabilities:{},clientInfo:{name:'24histories-chapter-client',version:'1.0.0'}}});
const result=await call({jsonrpc:'2.0',id:2,method:tool==='list_tools'?'tools/list':'tools/call',params:tool==='list_tools'?{}:{name:tool,arguments:argsFile?JSON.parse(fs.readFileSync(argsFile,'utf8')):{}}});
if(tool==='list_tools'){console.log(JSON.stringify(result));process.exit(0);}
if(result.isError)throw Error(result.content?.[0]?.text??'Chapter tool failed');console.log(result.content[0].text);
