/** Future-only replacement for shard prediction. No filesystem/global graph operations. Exact existing JSON shape and UTF-8 byte limit. */
export function linearJsonShards(field,encoding,entries,maximumShardBytes=2*1024*1024){
 const envelope=chunk=>JSON.stringify({field,encoding,entries:chunk})+'\n',emptyBytes=Buffer.byteLength(envelope([])),parts=[];let chunk=[],predictedBytes=emptyBytes;
 const flush=()=>{if(!chunk.length)return;const raw=Buffer.from(envelope(chunk));if(raw.length!==predictedBytes||raw.length>maximumShardBytes)throw Error('Shard byte accounting mismatch/oversize '+field);parts.push(raw);chunk=[];predictedBytes=emptyBytes};
 for(const entry of entries){const serialized=JSON.stringify([entry]).slice(1,-1),entryBytes=Buffer.byteLength(serialized);if(predictedBytes+entryBytes+(chunk.length?1:0)>maximumShardBytes)flush();if(emptyBytes+entryBytes>maximumShardBytes)throw Error('Single closed context entry oversized, explicit split required: '+field);predictedBytes+=entryBytes+(chunk.length?1:0);chunk.push(entry)}flush();return parts;
}
