import {isDeepStrictEqual} from 'node:util';
import {contentUnits,validateUnitIds,sha256} from './people-content.mjs';
const need=(ok,message)=>{if(!ok)throw Error('Footnote preparation: '+message);};
const hash=value=>sha256(JSON.stringify(value));
// Structural preparation only. Publication still requires the existing native
// independent footnote review, source/reference checks and exact contract pins.
export function prepareEnglishFootnoteAdditions(before,{book,chapter,authorAgentId,additions}){
 need(typeof authorAgentId==='string'&&authorAgentId.trim()===authorAgentId&&authorAgentId.length>0,'Declare actual author');
 need(Array.isArray(additions)&&additions.length>0,'Explicit additions required');
 const source=structuredClone(before),units=contentUnits(source),seen=new Set();validateUnitIds(units,'footnote preparation');
 for(const a of additions){
  need(a&&isDeepStrictEqual(Object.keys(a).sort(),['text','unit']),'Closed addition fields required');
  need(typeof a.unit==='string'&&!seen.has(a.unit),'Duplicate or invalid unit');seen.add(a.unit);
  need(typeof a.text==='string'&&a.text===a.text.trim()&&a.text.length>0,'Nonempty exact text required');
  const unit=units.find(u=>u.id===a.unit),translations=unit?.source?.translations?.filter(t=>t?.lang==='en');
  need(translations?.length===1&&!Object.hasOwn(translations[0],'footnote'),'Need one English translation without existing footnote');
  need([translations[0].literal,translations[0].idiomatic].some(t=>typeof t==='string'&&t.trim()),'English translation required');
  translations[0].footnote=a.text;
 }
 return{source,contract:{schemaVersion:1,kind:'english-footnote-additions',book,chapter,authorAgentId,beforeSourceHash:hash(before),afterSourceHash:hash(source),additions:structuredClone(additions)},approvalGranted:false};
}
