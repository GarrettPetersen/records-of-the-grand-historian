// Source-reviewed research candidate only. No canonical publication.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const fixture = resolve(process.argv[2] ?? '');
if (!fixture.startsWith('/tmp/jinshu129-precise.') || process.env.PEOPLE_REPO_ROOT !== fixture) throw Error('Dedicated fixture required');
const sha = value => createHash('sha256').update(value).digest('hex');
function load(path, expected) {
  const bytes = readFileSync(path);
  if (sha(bytes) !== expected) throw Error(`Input changed: ${path}`);
  return JSON.parse(bytes);
}
const held = load('research/people/jinshu129-final-materialized-20261020-incomplete.json', '3aeaf2fc42220e9beeca59388b778b8988db53542ac3ba49fba8e95e17024c26');
const candidate = structuredClone(held.extraction);
function replaceSurface(before, after) {
  const hits = candidate.surfaces.map((item, index) => isDeepStrictEqual(item, before) ? index : -1).filter(index => index >= 0);
  if (hits.length !== 1) throw Error(`Expected one surface: ${JSON.stringify(before)}`);
  candidate.surfaces[hits[0]] = after;
}
const beforeEnglish = ['p103','title-reference','en','Zhu Lingshi, governor of Yi for the Eastern Jin',[['s0183',[0]]]];
const beforeChinese = ['p103','title-reference','zh','益州刺史硃齡石',[['s0183',[0]],['s0188',[0]]]];
const afterEnglish = ['p103','personal-name','en','Zhu Lingshi',[['s0183',[0]]]];
const afterChinese = ['p103','personal-name','zh','硃齡石',[['s0183',[0]],['s0188',[0]]]];
replaceSurface(beforeEnglish, afterEnglish);
replaceSurface(beforeChinese, afterChinese);

const changes = [
  ['cand_8dc4288346d219dc','not-person','polity','Jin','not-person','place','Yi Province'],
  ['cand_8a551c2a741c2b24','not-person','polity','Jin','not-person','place','Yi Province'],
  ['cand_28a3080bfce53a76','duplicate-hint','duplicate-candidate','Contained in retained mention 益州刺史硃齡石','not-person','place','Yi Province'],
  ['cand_d179139b595c2857','duplicate-hint','duplicate-candidate','Contained in retained mention 益州刺史硃齡石','not-person','office','Regional inspector'],
  ['cand_ebe33751f3990fc7','duplicate-hint','duplicate-candidate','Contained in retained mention 益州刺史硃齡石','not-person','place','Yi Province'],
  ['cand_4b2afa438eb15ac2','duplicate-hint','duplicate-candidate','Contained in retained mention 益州刺史硃齡石','not-person','office','Regional inspector'],
  ['cand_77ec019e708a0171','duplicate-hint','duplicate-candidate','Contained in retained mention Zhu Lingshi, governor of Yi for the Eastern Jin',null,null,null],
  ['cand_ea6519a039092626','duplicate-hint','duplicate-candidate','Contained in retained mention Zhu Lingshi, governor of Yi for the Eastern Jin',null,null,null],
  ['cand_d162756b159cff9a','not-person','other','Xuanyuan names the astronomical asterism in this omen, not the Yellow Thearch.',null,null,null],
];
for (const [id, oldDisposition, oldReason, oldNote, disposition, reason, note] of changes) {
  const hits = candidate.candidateDispositions.flatMap((group, gi) => group[2].map((row, ri) => ({group,gi,row,ri})).filter(hit => hit.row[0] === id));
  if (hits.length !== 1) throw Error(`Expected one disposition: ${id}`);
  const hit = hits[0];
  if (!isDeepStrictEqual([hit.group[0],hit.group[1],hit.row[1]], [oldDisposition,oldReason,oldNote])) throw Error(`Stale disposition: ${id}`);
  hit.group[2].splice(hit.ri, 1);
  if (disposition) {
    let group = candidate.candidateDispositions.find(row => row[0] === disposition && row[1] === reason);
    if (!group) { group = [disposition, reason, []]; candidate.candidateDispositions.push(group); }
    group[2].push([id,note]);
  }
}
const mod = name => import(pathToFileURL(join(fixture, 'scripts', name)).href);
const { buildPeopleExtractionPacket } = await mod('build-people-extraction-packet.mjs');
const { validateCompactPeopleExtraction } = await mod('validate-people-extraction.mjs');
const { validateAppliedEditorialDecisions } = await mod('lib/people-editorial-decisions.mjs');
const packet = buildPeopleExtractionPacket('jinshu','129',{chapterData:held.source});
const result = validateCompactPeopleExtraction(candidate, packet, {strictAliasDispositions:true});
validateAppliedEditorialDecisions(held.editorial, result.normalized);
const out = {status:'research-only-not-approved', stagingImplementation:'fce861bb48533eeb388dc5573a60000f14167984', heldWrapperSha256:'3aeaf2fc42220e9beeca59388b778b8988db53542ac3ba49fba8e95e17024c26', reviewRequired:'Fresh independent exact final review, full date audit, identity reconciliation, and all publication gates remain required.', changes:{surfaces:[{before:beforeEnglish,after:afterEnglish},{before:beforeChinese,after:afterChinese}],dispositions:changes}, stats:result.stats, source:held.source, extraction:candidate, editorial:held.editorial};
const bytes = Buffer.from(`${JSON.stringify(out,null,2)}\n`);
const output = 'research/people/jinshu129-precise-mentions-candidate-20261020-incomplete.json';
writeFileSync(output, bytes, {flag:'wx',mode:0o600});
console.log(`${output} sha256:${sha(bytes)}; research only`);
