const need=(v,m)=>{if(!v)throw Error(m)};
export function decodeEnglishRepairPacket(raw){
  need(raw?.schemaVersion===1&&raw.kind==='independent-source-English-repair-packet','Exact English repair packet kind required');
  const input=structuredClone(raw);
  need(Array.isArray(input.sourceUnits)&&Array.isArray(input.proposals)&&new Set(input.sourceUnits.map(u=>u.id)).size===input.sourceUnits.length,'Unique complete source-unit index required');
  for(const p of input.proposals)need(['source-English','claim-label','person-label'].includes(p.recordKind)&&(p.recordKind!=='source-English'||['en','literal'].includes(p.field)),'Only declared English source/record wording targets are permitted');
  if(input.referenceEncoding===undefined)return input;
  need(input.referenceEncoding==='source-unit-fields-v1','Unknown repair packet reference encoding');
  const units=new Map(input.sourceUnits.map(u=>[u.id,u]));
  for(const p of input.proposals)for(const field of ['before','sourceQuote']){
    const value=p[field];if(typeof value==='string')continue;
    const ref=value?.$unitField;
    need(value&&Object.keys(value).length===1&&Array.isArray(ref)&&ref.length===2&&ref[0]===p.unit&&ref[1]===(field==='sourceQuote'?'zh':p.field),'Exact own-unit source reference required');
    const resolved=units.get(ref[0])?.[ref[1]];need(typeof resolved==='string'&&resolved.length>0,'Missing referenced source text');p[field]=resolved;
  }
  delete input.referenceEncoding;return input;
}
export function encodeEnglishRepairPacket(input){
  const encoded=structuredClone(input),units=new Map(input.sourceUnits.map(u=>[u.id,u]));
  encoded.referenceEncoding='source-unit-fields-v1';
  for(const p of encoded.proposals){
    const u=units.get(p.unit);need(u&&p.sourceQuote===u.zh,'Exact source quote required');
    p.sourceQuote={$unitField:[p.unit,'zh']};
    if(p.recordKind==='source-English'){need(p.before===u[p.field],'Exact current English before required');p.before={$unitField:[p.unit,p.field]};}
  }
  need(JSON.stringify(decodeEnglishRepairPacket(encoded))===JSON.stringify(input),'Lossless packet reconstruction failed');return encoded;
}
