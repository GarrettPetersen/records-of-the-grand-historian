import {chineseVariantComparisonKey} from '../../scripts/lib/people-chinese-variants.mjs';
const encoder = new TextEncoder();
export const json = (value, status = 200, extra = {}) => new Response(JSON.stringify(value), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extra },
});
export async function sha256(text) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(text)))].map(x => x.toString(16).padStart(2, '0')).join('');
}
export function normalizedSearchKey(text) {
  if (typeof text !== 'string' || !text.trim() || text.length > 160) throw Error('Use a name/key of 1–160 characters');
  if (/^(en|zh):/.test(text)) return text;
  const language = /\p{Script=Han}/u.test(text) ? 'zh' : 'en';
  const value = text.normalize('NFKC').trim();
  const normalized = language === 'en' ? value.normalize('NFKD').replace(/[\u0300-\u036f]/gu, '').toLocaleLowerCase('en').replace(/[^a-z0-9]+/gu,' ').trim().replace(/\s+/gu,' ').replace(/^the\s+/u,'') : value.replace(/[\s\p{P}\p{S}]+/gu,'');
  if(!normalized)throw Error('Name has no searchable characters');
  return language === 'zh' ? chineseVariantComparisonKey(`zh:${normalized}`) : `en:${normalized}`;
}
export async function consumeBudget(storage, now, daily = 1000, perMinute = 60) {
  return storage.transaction(async txn => {
    const day = Math.floor(now / 86400000), minute = Math.floor(now / 60000);
    const old = await txn.get('usage');
    const value = { day, minute, daily: old?.day === day ? old.daily : 0, perMinute: old?.minute === minute ? old.perMinute : 0 };
    if (value.daily >= daily || value.perMinute >= perMinute) return false;
    value.daily++; value.perMinute++; await txn.put('usage', value); return true;
  });
}
async function objectBytes(env, key, range, maximum = 256 * 1024) {
  const object = await env.PEOPLE_DATA.get(`${env.REGISTRY_PREFIX}/${key}`, range ? { range } : undefined);
  if (!object) return null;
  if (object.size > maximum && !range) throw Error('Stored lookup shard exceeds the documented bound');
  const bytes = new Uint8Array(await object.arrayBuffer());
  if (bytes.length > maximum) throw Error('Stored lookup response exceeds the documented bound');
  return bytes;
}
async function lookup(env, kind, key) {
  const rowKey = JSON.stringify([kind, key]);
  const bucket = (await sha256(rowKey)).slice(0, 3);
  const bytes = await objectBytes(env, `index/${bucket}.jsonl`);
  if (!bytes) return null;
  let match;
  for (const line of new TextDecoder().decode(bytes).split('\n').filter(Boolean)) {
    const row = JSON.parse(line);
    if (row[0] === rowKey) { if (match !== undefined) throw Error('Duplicate stored index key'); match = row[1]; }
  }
  return match ?? null;
}
async function dossier(env, id) {
  const location = await lookup(env, 'dossier', id);
  if (!location) return null;
  if (!Number.isSafeInteger(location.offset) || location.offset < 0 || !Number.isSafeInteger(location.bytes) || location.bytes < 1 || location.bytes > 2 * 1024 * 1024) {
    throw Error('Dossier exceeds the bounded record transport; request host preparation');
  }
  const chunkSize = 32 * 1024 * 1024;
  const result = new Uint8Array(location.bytes);
  let copied = 0;
  while (copied < location.bytes) {
    const offset = location.offset + copied, chunk = Math.floor(offset / chunkSize), within = offset % chunkSize;
    const length = Math.min(location.bytes - copied, chunkSize - within);
    const bytes = await objectBytes(env, `data/${String(chunk).padStart(4, '0')}.bin`, { offset: within, length }, 2 * 1024 * 1024);
    if (!bytes || bytes.length !== length) throw Error('Incomplete stored dossier range');
    result.set(bytes, copied); copied += length;
  }
  const actual = [...new Uint8Array(await crypto.subtle.digest('SHA-256', result))].map(x => x.toString(16).padStart(2, '0')).join('');
  if (actual !== location.sha256) throw Error('Stored dossier checksum mismatch');
  const value = JSON.parse(new TextDecoder().decode(result));
  if (value.id !== id || value.version !== location.version) throw Error('Stored dossier identity/version mismatch');
  return value;
}
export async function handleLookup(request, env) {
  const url = new URL(request.url);
  if (request.method !== 'GET') return json({error:'Read-only API; use GET'},405);
  if (url.pathname === '/health') return json({service:'24histories-people-lookup',status:'ok',registry:env.REGISTRY_PREFIX});
  const bearer = request.headers.get('authorization') ?? '';
  if (!env.PEOPLE_API_TOKEN_SHA256 || !bearer.startsWith('Bearer ') || bearer.length > 256 || await sha256(bearer.slice(7)) !== env.PEOPLE_API_TOKEN_SHA256) {
    return json({error:'Bearer token required'},401);
  }
  const search = url.pathname === '/v1/search', person = url.pathname.match(/^\/v1\/people\/(per_[A-Za-z0-9]+)$/);
  if (!search && !person && url.pathname !== '/v1/manifest') return json({error:'Unknown read-only route'},404);
  let key, limit;
  if (search) {
    if ([...url.searchParams.keys()].some(k => !['q','key','limit'].includes(k)) || (url.searchParams.has('q') && url.searchParams.has('key'))) return json({error:'Use q or key, and optional limit'},400);
    try { key = normalizedSearchKey(url.searchParams.get('key') ?? url.searchParams.get('q')); } catch (e) { return json({error:e.message},400); }
    limit = Number(url.searchParams.get('limit') ?? 8);
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 8) return json({error:'limit must be 1–8'},400);
  } else if (person && [...url.searchParams.keys()].some(k => k !== 'member')) return json({error:'Only member is supported'},400);
  if (!(await env.PEOPLE_RATE.limit({key:'lookup'})).success) return json({error:'Rate limit'},429,{'retry-after':'60'});
  const budget = env.PEOPLE_BUDGET.get(env.PEOPLE_BUDGET.idFromName('global-v1'));
  const admission = await budget.fetch('https://budget.internal/admit');
  if (admission.status !== 200) return json({error:'Global request budget exhausted; retry later'},429,{'retry-after':'60'});
  try {
    if (search) {
      const entry = await lookup(env,'postings',key);
      return json({registry:env.REGISTRY_PREFIX,key,total:entry?.total??0,ids:entry?.ids.slice(0,limit)??[],
        truncated:Boolean(entry && entry.total > Math.min(entry.ids.length,limit)),postingFingerprint:entry?.fingerprint??null,
        caution:'Candidates only, not identity decisions. Empty/truncated search is not proof of uniqueness. Prefer native keys from dossier names.'});
    }
    if (person) {
      const canonical = await lookup(env,'canonicalByKnownId',person[1]) ?? person[1];
      const value = await dossier(env,canonical);
      if (!value) return json({error:'Unknown dossier'},404);
      const member = url.searchParams.get('member');
      if (member && !value.localPeople.includes(member)) return json({error:'Member does not belong to this dossier'},404);
      const evidence = member ? value.identityEvidence.filter(x=>x.localId===member) : [];
      const response = {registry:env.REGISTRY_PREFIX,id:value.id,version:value.version,names:value.names,
        localPeople:value.localPeople,anchorCandidates:value.anchorCandidates,matching:value.matching,
        identityEvidence:evidence,evidenceMembers:value.identityEvidence.length,memberRequiredForEvidence:!member,
        sourceEditorialApproval:false,chronologyApproval:false,publicationApproval:false};
      if (encoder.encode(JSON.stringify(response)).length > 128*1024) return json({error:'Dossier response too large; request a bounded host packet'},413);
      return json(response);
    }
    const bytes=await objectBytes(env,'manifest.json');
    if(!bytes)throw Error('Registry manifest is missing');
    return json(JSON.parse(new TextDecoder().decode(bytes)));
  } catch (error) { return json({error:'Lookup failed closed',detail:error.message},503); }
}
