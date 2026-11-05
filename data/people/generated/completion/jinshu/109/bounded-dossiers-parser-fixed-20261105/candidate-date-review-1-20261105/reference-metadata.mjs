import {createHash} from 'node:crypto';
export function deriveLocalReferenceMetadata(raw,packet){
 const normalized=structuredClone(raw),changes=[];
 for(const[index,ref]of normalized.references.entries()){
  if(ref.kind!=='internal')continue;
  const unit=packet.units.find(u=>u.id===ref.unit);
  if(!unit||typeof ref.quote!=='string'||!ref.quote||!unit.zh.includes(ref.quote))throw Error('Internal citation must quote its exact supplied source unit');
  const expected={book:packet.book,chapter:packet.chapter,sourceHash:'sha256:'+createHash('sha256').update(unit.zh).digest('hex')};
  for(const[field,value]of Object.entries(expected)){
   if(ref[field]!==undefined){if(ref[field]!==value)throw Error('Existing internal citation metadata contradicts source');continue;}
   changes.push({referenceIndex:index,field,before:'missing',after:value,unit:ref.unit,quotePreserved:ref.quote});ref[field]=value;
  }
 }
 if(!changes.length)throw Error('No missing local citation metadata to derive');
 return{normalized,changes};
}
