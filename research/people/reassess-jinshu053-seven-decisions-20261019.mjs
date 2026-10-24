// Independent reassessment of two disputed translation choices; no canonical writes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validatePeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import { validateEditorialDecisions } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
const root = 'data/people/generated/jinshu-identity-ref-64521198-20261018';
const base = `${root}/jinshu053-source-reviewed-reconciliation-v2-incomplete-20261020`;
const output = `${root}/jinshu053-seven-independent-reassessed-decisions-20261019-incomplete.json`;
function read(file, digest) {
  const bytes = fs.readFileSync(file);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), digest, file);
  return JSON.parse(bytes);
}
const source = read(`${base}/source.json`, 'a810ace8d38f97313800c968c6858373dc08c98ef08440dfa56e6907a9bd950c');
const extraction = read(`${base}/proposed-extraction.json`, '3a5a61d771beee8a11b8fdbe9e0d357eeda47e30ef3ea289c11f87cc08370d27');
const review = read(`${root}/jinshu053-seven-independent-decisions-20261019-incomplete.json`, 'c009fe89a8d501132b56a96895e8ad1d2e4979627eb9de2b520f4b5b23a48175');
const revisions = {
  'jinshu:053:r0108': ['Dan had Crown Princess Wang and the three imperial grandsons escorted to Jinyong City under armed guard; Consort Shufei Xie and Jiang Jun, a baolin of the crown prince, were interrogated to death.', 'Reconsidering 澹以兵仗送 and 考竟, the source attributes the escort to Dan but does not establish his personal presence; passive phrasing also avoids assigning who personally conducted the fatal interrogation. 保林 is a rank, not an heir guardian.'],
  'jinshu:053:r0109': ['Dan had Crown Princess Wang and the three imperial grandsons escorted to Jinyong City under armed guard; Consort Shufei Xie and Jiang Jun, a crown prince’s consort of the rank of baolin, were interrogated to death.', 'The concise source associates Dan with the armed escort without specifying personal presence, and does not name the interrogators. This revision preserves that uncertainty while retaining 考竟 and the consort rank 保林.'],
  'jinshu:053:r0110': ['When Deposed Commoner Jia died, they executed Liu Zhen, Sun Lü, Cheng Ju, and others, and restored the crown prince by patent, saying: “The emperor sends an envoy bearing the credentials, Commandant of the Guard Yi, concurrently serving as Director of Works, to announce by patent to the spirit of the late crown prince: Alas!', '持節 describes the envoy bearing a token of official authority; credentials preserves its function without implying a numerical tally. 伊 is the envoy’s name and 策 is the patent action, not part of that name.'],
};
for (const decision of review.decisions) {
  const row = revisions[decision.repairId];
  if (!row) continue;
  decision.decision = 'revise';
  decision.after = row[0];
  decision.reason = row[1];
}
review.reviewer.completedAt = new Date().toISOString();
const packet = buildPeopleExtractionPacket('jinshu','053',{chapterData:source});
const normalized = validatePeopleExtraction(extraction,packet,{strictAliasDispositions:true}).normalized;
validateEditorialDecisions(review,normalized,packet);
fs.writeFileSync(output, `${JSON.stringify(review,null,2)}\n`, {flag:'wx'});
console.log(JSON.stringify({output, sha256:createHash('sha256').update(fs.readFileSync(output)).digest('hex'), reassessed:Object.keys(revisions), status:'valid decision document; later reconciliation and independent audits still required'},null,2));
