import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validatePeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import { validateEditorialDecisions } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';

const base = 'data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-source-reviewed-reconciliation-v2-incomplete-20261020';
const output = 'data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-seven-independent-decisions-20261019-incomplete.json';
const expected = {
  'source.json': 'a810ace8d38f97313800c968c6858373dc08c98ef08440dfa56e6907a9bd950c',
  'proposed-extraction.json': '3a5a61d771beee8a11b8fdbe9e0d357eeda47e30ef3ea289c11f87cc08370d27',
  'blank-decision-seed.json': '340acb3817ec29c27a2060f0289208c5b5e9fd817b5d82297db85780886bacc7',
};
function read(name) {
  const bytes = fs.readFileSync(`${base}/${name}`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), expected[name], name);
  return JSON.parse(bytes);
}
const source = read('source.json');
const extraction = read('proposed-extraction.json');
const review = read('blank-decision-seed.json');
const packet = buildPeopleExtractionPacket('jinshu', '053', { chapterData: source });
assert.equal(packet.input.chapterFingerprint, review.input.chapterFingerprint);
const normalized = validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true }).normalized;
review.reviewer = { kind: 'codex', name: 'Codex independent editorial reviewer', model: null, agentId: '/root/independent_decisions', runId: null, completedAt: new Date().toISOString() };
const details = {
  'r0108': ['revise', 'Dan escorted Crown Princess Wang and the three imperial grandsons to Jinyong City with armed soldiers, and had Consort Shufei Xie and Jiang Jun, a baolin of the crown prince, interrogated to death.', '以兵仗送 describes Dan escorting with armed force; it does not specify that he sent guards without going. 考竟 is interrogation to death and 保林 is a rank, not an heir guardian.', 's0065', '澹以兵仗送太子妃王氏、三皇孫于金墉城，考竟謝淑妃及太子保林蔣俊。'],
  'r0109': ['revise', 'Dan escorted Crown Princess Wang and the three imperial grandsons to Jinyong City under armed guard, and had Consort Shufei Xie and Jiang Jun, a crown prince’s consort of the rank of baolin, interrogated to death.', 'The source says Dan escorted them with armed force, not that he sent guards separately. 考竟 specifies interrogation to death; the rank 保林 is not an heir guardian.', 's0065', '澹以兵仗送太子妃王氏、三皇孫于金墉城，考竟謝淑妃及太子保林蔣俊。'],
  'r0110': ['accept', null, '伊 is the name of the envoy; 策 is the patent action and is not part of his name. 兼司空 and 衛尉 identify his offices.', 's0131', '皇帝使使持節、兼司空、衛尉伊策故皇太子之靈曰'],
  'r0111': ['revise', 'In youth you bore a nature quick and wise; you received the late emperor’s extraordinary favor. Your domain was greatly opened, and you came to possess Huailing.', '淮陵 is Huailing, not Hailing. The parallel phrases describe the opening of the domain and possession of Huailing without explicitly assigning both actions to the late emperor.', 's0132', '維爾少資岐嶷之質，荷先帝殊異之寵，大啟土宇，奄有淮陵。'],
  'r0112': ['revise', 'From youth you showed remarkable intelligence and received the late emperor’s extraordinary favor. Your domain was greatly expanded, and you came to possess Huailing.', 'The speech directly addresses the deceased, and 淮陵 is Huailing. The source does not explicitly say that the late emperor personally granted both territorial actions.', 's0132', '維爾少資岐嶷之質，荷先帝殊異之寵，大啟土宇，奄有淮陵。'],
  'r0113': ['accept', null, '追封 means posthumous enfeoffment; 四月 gives the fourth month. The preceding unit identifies the deceased subject, although its missing written name remains a separate source issue.', 's0172', '四月，追封南陽王。'],
  'r0114': ['accept', null, '追封 is a posthumous grant of title. The preceding unit provides the deceased subject; this decision does not repair or settle its missing name.', 's0172', '四月，追封南陽王。'],
};
for (const decision of review.decisions) {
  const key = decision.repairId.split(':').at(-1);
  const row = details[key];
  assert(row, key);
  [decision.decision, decision.after, decision.reason] = row;
  decision.sourceWitness = { source: 'chapter-text', citation: `jinshu:053:${row[3]}`, excerpt: row[4] };
}
assert.equal(review.decisions.length, Object.keys(details).length);
validateEditorialDecisions(review, normalized, packet);
fs.writeFileSync(output, `${JSON.stringify(review, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ output, sha256: createHash('sha256').update(fs.readFileSync(output)).digest('hex'), decisions: review.decisions.map(d => ({ repairId: d.repairId, decision: d.decision })) }, null, 2));
