import {isDeepStrictEqual} from 'node:util';
const need=(ok,message)=>{if(!ok)throw Error('Array removal: '+message);};
// All exact-before checks precede mutation. The caller owns the single durable
// document write, revision and journal. This function grants no approval.
export function applyExactArrayRemovals(array,expectedLength,removals){
 need(Array.isArray(array)&&array.length===expectedLength,'Array length changed');
 need(Array.isArray(removals)&&removals.length>0&&removals.length<=32,'Remove one to32 exact rows');
 const seen=new Set();
 for(const r of removals){
  need(r&&isDeepStrictEqual(Object.keys(r).sort(),['before','index']),'Exact removal fields required');
  need(Number.isSafeInteger(r.index)&&r.index>=0&&r.index<array.length&&!seen.has(r.index),'Invalid or duplicate index');seen.add(r.index);
  need(isDeepStrictEqual(array[r.index],r.before),'Exact-before mismatch');
 }
 for(const index of [...seen].sort((a,b)=>b-a))array.splice(index,1);
 return array;
}
