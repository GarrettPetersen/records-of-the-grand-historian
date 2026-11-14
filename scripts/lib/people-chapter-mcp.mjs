import {McpServer,createMcpHandler} from '@modelcontextprotocol/server';
import {toNodeHandler} from '@modelcontextprotocol/node';
import * as z from 'zod/v4';
import fs from 'node:fs';
import path from 'node:path';
import {authenticateChapterRole,chapterOperation,ownerDirectory,digest} from './people-chapter-owner.mjs';
import {peopleLookup} from './people-lookup-client.mjs';
import {contentUnits} from './people-content.mjs';

export function chapterMcpHandler(root,id,role,token){
 authenticateChapterRole(root,id,role,token);
 const server=()=>{
  const mcp=new McpServer({name:'24histories-chapter-owner',version:'1.0.0'},{instructions:'Own your sealed chapter end to end. Read manifest and recover prior work. Submit individual exact-before patches and repairs. Never clone or create a worktree. Publication is host-owned and approvals require independent review.'});
  const run=(op,args)=>{try{return{content:[{type:'text',text:JSON.stringify(chapterOperation(root,id,role,op,args))}]};}catch(error){return{isError:true,content:[{type:'text',text:error.message}]};}};
  mcp.registerTool('chapter_manifest',{description:'Read scope, revision, recovery artifact index, covered units and blockers. Page artifacts with nextArtifactOffset. No approval implied.',inputSchema:z.object({artifactOffset:z.number().int().nonnegative().optional()})},args=>run('manifest',args));
  mcp.registerTool('chapter_read',{description:'Read sealed artifact or draft:TARGET. Optional JSON pointer retrieves a subtree. Page with returned nextOffset. Max 16000 characters.',inputSchema:z.object({artifact:z.string(),pointer:z.string().optional(),offset:z.number().int().nonnegative().optional()})},args=>run('read',args));
  mcp.registerTool('chapter_patch',{description:'Record one small exact-before draft patch. To append ONE claim use add:true, pointer:/claims/- (or /claims/N with N=current length), after:ONE_RECORD; omit before. Owner targets extraction/materialization/editorial-proposals; independent reviewer targets editorial/identity-review/date-report/review-validation/input-seal. Retained editorial history is preserved, not recreated or owner-approved. No canonical writes.',inputSchema:z.object({revision:z.number().int(),target:z.string(),pointer:z.string(),before:z.unknown().optional(),after:z.unknown(),add:z.boolean().optional()})},args=>run('patch',args));
  mcp.registerTool('chapter_repair',{description:'Record one complete source-backed English replacement and explicit confidence. The host compiles final per-field deltas into native repair/proposal records before review. Check both English fields and repetitions. No canonical writes.',inputSchema:z.object({revision:z.number().int(),unitId:z.string(),field:z.enum(['idiomatic','literal']),before:z.string(),after:z.string(),reason:z.string(),confidence:z.enum(['high','medium','low'])})},args=>run('repair',args));
  mcp.registerTool('chapter_coverage',{description:'Record units actually reviewed in Chinese and both English fields. Existing source review can be reused only after checking its pins.',inputSchema:z.object({revision:z.number().int(),unitIds:z.array(z.string()),bothEnglishFields:z.literal(true)})},args=>run('coverage',args));
  mcp.registerTool('chapter_finding',{description:'Save a precise finding. Independent reviewer: use repair-required for concrete corrections, research-hold for genuinely unresolved evidence, note otherwise. Preserve prior progress.',inputSchema:z.object({revision:z.number().int(),text:z.string(),disposition:z.enum(['note','repair-required','research-hold']).optional()})},args=>run('finding',args));
  mcp.registerTool('chapter_finish',{description:'Request host validation and independent review. Does NOT approve or publish a chapter.',inputSchema:z.object({revision:z.number().int()})},args=>run('finish',args));
  mcp.registerTool('chapter_validate',{description:'Run the production extraction validator on the current source/candidate draft. Returns compact errors and a complete paged report. Does not approve dates, identity or publication.',inputSchema:z.object({})},args=>run('validate',args));
  const lookup=async route=>{try{const result=await peopleLookup(route,{...process.env,PEOPLE_LOOKUP_URL:'https://24histories-people-lookup.garrett-m-petersen.workers.dev'});const job=JSON.parse(fs.readFileSync(path.join(ownerDirectory(root,id),'job.json')));if(result.registry!==job.lookupGeneration)throw Error('Lookup generation changed; host reconciliation required');return{content:[{type:'text',text:JSON.stringify(result)}]};}catch(e){return{isError:true,content:[{type:'text',text:e.message}]};}};
  mcp.registerTool('people_search',{description:'Search pinned canonical-person aliases; truncated or empty results do not establish uniqueness.',inputSchema:z.object({name:z.string().max(160)})},args=>lookup('/v1/search?'+new URLSearchParams({q:args.name})));
  mcp.registerTool('people_dossier',{description:'Read canonical dossier header or source evidence for one exact local member.',inputSchema:z.object({id:z.string().regex(/^per_[A-Za-z0-9]+$/),member:z.string().optional()})},args=>lookup('/v1/people/'+args.id+(args.member?'?'+new URLSearchParams({member:args.member}):'')));
  mcp.registerTool('chapter_append',{description:'Append a bounded batch of 1–32 individually reviewed records to an existing draft array. Use exact current revision and expectedLength. This avoids whole-report JSON and per-row network overhead; it grants no approval.',inputSchema:z.object({revision:z.number().int(),target:z.string(),pointer:z.string(),expectedLength:z.number().int().nonnegative(),records:z.array(z.unknown()).min(1).max(32)})},args=>run('append',args));
  mcp.registerTool('people_source_units',{description:'Retrieve up to eight exact primary-source units named by dossier evidence, e.g. songshu:007:s0055. Returns Chinese and both English fields, with source-file hash. No inference or approval.',inputSchema:z.object({references:z.array(z.string().max(128)).min(1).max(8)})},args=>{
   try{
    const sources=new Map(),units=[];
    for(const ref of args.references){
     const match=/^([a-z0-9_-]+):(\d{3}):([^\s/:]+)$/.exec(ref);if(!match)throw Error('Use exact book:chapter:unit references');
     const key=match[1]+'/'+match[2];
     if(!sources.has(key)){
      const file=path.join(root,'data',match[1],match[2]+'.json');if(fs.realpathSync(file)!==file||fs.statSync(file).size>4*1024*1024)throw Error('Primary source needs a bounded sealed host packet');
      const bytes=fs.readFileSync(file);sources.set(key,{sha256:digest(bytes),units:contentUnits(JSON.parse(bytes))});
     }
     const source=sources.get(key),unit=source.units.find(u=>u.id===match[3]);if(!unit)throw Error('Primary source unit not found: '+ref);
     units.push({reference:ref,sourceFileSha256:source.sha256,zh:unit.zh,en:unit.en,literal:unit.literal,rawUnit:unit.source});
    }
    const text=JSON.stringify({evidenceOnly:true,units});if(Buffer.byteLength(text)>64000)throw Error('Primary evidence response exceeds 64 KiB; request fewer units');return{content:[{type:'text',text}]};
   }catch(error){return{isError:true,content:[{type:'text',text:error.message}]};}
  });
  return mcp;
 };
 return toNodeHandler(createMcpHandler(server,{legacy:'stateless',responseMode:'json'}));
}

export function chapterBootstrap(root,id,role,key){
 const dir=ownerDirectory(root,id),file=path.join(dir,role+'-bootstrap.json');
 const ticket=JSON.parse(fs.readFileSync(file,'utf8'));
 if(ticket.key!==key||Date.parse(ticket.expiresAt)<Date.now())throw Error('Bootstrap expired or unauthorized');
 // Node's synchronous consume precedes network writes: a second request cannot redeem it.
 fs.unlinkSync(file);
 const token=fs.readFileSync(path.join(dir,role+'-token'),'utf8');
 return{token,url:`https://grokbot-mcp.24histories.com/chapter-mcp/${id}/${role}`};
}
