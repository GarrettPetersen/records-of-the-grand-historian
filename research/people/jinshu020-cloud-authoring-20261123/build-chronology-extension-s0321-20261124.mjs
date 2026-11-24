#!/usr/bin/env node
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readJson } from '../../../scripts/lib/people-content.mjs';
import { validateDateAuditReport } from '../../../scripts/lib/people-date-audit.mjs';

const ART = '/agent/repos/records-of-the-grand-historian/research/people/jinshu020-cloud-authoring-20261123';
const prior = readJson(`${ART}/date-audit-report-partial-s0037-s0320.json`);
const pin = readJson(`${ART}/date-audit-packet-post-editorial-pin.json`);
const unitMap = new Map(pin.units.map((u) => [u.id, u]));

function quote(unitId, q) {
  const zh = unitMap.get(unitId)?.zh ?? '';
  if (!zh.includes(q)) throw new Error(`Quote mismatch ${unitId} ${q}`);
  return { unit: unitId, quote: q };
}

function mk(id, verdict, event, reason, unit, q) {
  return { id, verdict, event, reason, evidence: [quote(unit, q)] };
}

const batchA = [
  mk('claim-149', 'supported', 'Han Emperor Ming cited for princely mourning at Jinting.', 's0332 opens with 漢明帝時 for the Donghai prince mourning example; AD 70 framing is historical allusion.', 's0332', '漢明帝時'),
  mk('claim-150', 'supported', 'Emperor Wu regulated ministerial mourning music after death.', 's0333 records 武帝十一月詔 on三公大臣薨 music; s0351 adds 泰始十年 and 太康七年 as explicit Jin witnesses in the same policy thread.', 's0351', '泰始十年'),
  mk('claim-151', 'incorrect', 'Emperor Yuan’s Guangchang aunt mourning before burial.', 's0334 gives 元帝姨廣昌鄉君喪 without 太兴/大兴元年; Taixing 1 is not on the cited line.', 's0334', '元帝姨'),
  mk('claim-152', 'supported', 'Censor Xiong Yuan memorialized on Yuan-di aunt mourning music.', 'Xiong Yuan’s表 at s0334 anchors the Eastern Jin mourning-music dispute with clear actor attribution.', 's0334', '熊遠表'),
  mk('claim-153', 'supported', 'Ritual scholar He Xun answered on Guangchang mourning music.', 'He Xun replies at s0341 in direct continuation of the Yuan-di aunt and Wu-di precedent discussion.', 's0341', '賀循答曰'),
  mk('claim-154', 'supported', 'Jin minister Zhi Ying in the Ping-gong music anecdote.', 's0343 cites智悼子 unburied and Ping-gong’s music as Spring and Autumn proof; BC dating is allusive.', 's0343', '智悼子'),
  mk('claim-155', 'supported', 'Duke Ping of Jin in the Zhi Ying music anecdote.', 'The same s0343 line pairs Duke Ping with the unburied Zhi Ying narrative.', 's0343', '平公作樂'),
  mk('claim-156', 'supported', 'Musician Tu Yan criticized Ping-gong in the anecdote.', 's0343 names屠蒯所譏 as the critic in the classical citation.', 's0343', '屠蒯'),
  mk('claim-157', 'supported', 'Emperor’s aunt Luling princess unburied in Shengping 1.', 's0346 gives 升平元年 and the Luling princess funeral music question explicitly.', 's0346', '升平元年'),
  mk('claim-158', 'supported', 'Erudite Hu Na on princess mourning music.', 'Hu Na argues at s0347 in the 升平元年 princess memorial sequence.', 's0347', '胡訥議'),
  mk('claim-159', 'incorrect', 'Chamberlain cited for princess winter assembly debate.', 'The cited line at s0349 is 太常王彪之, not Che Yin; the person-date pairing on the claim is wrong.', 's0349', '王彪之'),
  mk('claim-160', 'supported', 'Changle elder princess died in Taishi 10.', 's0351 gives 泰始十年春，長樂長公主薨 with explicit dating.', 's0351', '泰始十年'),
  mk('claim-161', 'supported', 'Prince of Fufeng died in Taikang 7.', 's0351 pairs 太康七年秋，扶風王駿薨 with the Taishi 10 example in the same imperial edict discussion.', 's0351', '太康七年'),
  mk('claim-162', 'incorrect', 'Zhi Yu on sojourning dukes mourning grade.', 's0357 opens Zhi Yu’s寄公 argument without 太安元年 or another reign year on the line.', 's0357', '摯虞以為'),
  mk('claim-163', 'incorrect', 'Zhi Yu on teacher-student mourning and reform blocks.', 's0365–s0372 continue Zhi Yu reforms without Taian 1 in Chinese; Taian 1 is table-only.', 's0372', '摯虞以為'),
  mk('claim-164', 'supported', 'Wei Wu cited for frugal funeral garment reforms.', 's0368 and s0388 narrate曹操豫制送終衣服 in the Wei–Jin funeral-reform history.', 's0388', '魏武'),
  mk('claim-165', 'supported', 'Confucius cited on universal teachers in Zhi Yu’s argument.', 's0381 quotes Confucius on三人行 in the teacher-mourning debate.', 's0381', '三人行'),
  mk('claim-166', 'supported', 'Zigong cited on having no constant teacher.', 's0382 continues Zigong’s saying in the same Zhi Yu memorial chain.', 's0382', '子貢云'),
  mk('claim-167', 'supported', 'Confucius disciple voice in the teacher-mourning section.', 's0373 records Zigong’s request on mourning Confucius without equaling a parent; BC hints are allusive.', 's0373', '子貢曰'),
  mk('claim-168', 'supported', 'Wei Emperor Wen followed Wu’s frugal burial practice.', 's0390 states文帝遵奉 and s0393 gives黃初三年終制 with explicit Wei chronology.', 's0393', '黃初三年'),
  mk('claim-169', 'research-blocked', 'Wei Emperor Ming and late Wei funeral extravagance.', 's0400 discusses明帝性雖崇奢 without AD 230 or a reign year on the line.', 's0400', '明帝'),
];

const batchB = [
  mk('claim-170', 'supported', 'Wei Emperor Xuan prepared Shouyang earth burial.', 's0401 records宣帝豫自于首陽山 as the Wei Shouyang tomb precedent.', 's0401', '宣帝'),
  mk('claim-171', 'supported', 'Wei Emperor Jing followed Xuan’s tomb commands.', 's0402 states景、文皆謹奉成命 in the Wei succession tomb narrative.', 's0402', '景、文'),
  mk('claim-172', 'supported', 'Jin Emperor Wen identified in the Wei–Jin tomb handoff.', 'The same s0402 cluster transitions toward Jin founding tomb practice with 景/文 obeying Wei commands before Wen’s line.', 's0402', '謹奉成命'),
  mk('claim-173', 'supported', 'Jin Emperor Wu at Empress Wenming’s Taishi 4 burial.', 's0404 gives武帝泰始四年，文明王皇后崩 with explicit reign year.', 's0404', '泰始四年'),
  mk('claim-174', 'supported', 'Empress Wenming died in Taishi 4 for Chongyang tomb opening.', 'The same s0404 line names文明王皇后崩 and the Chongyang tomb ritual.', 's0404', '文明王皇后崩'),
  mk('claim-175', 'supported', 'Grand Commandant Sima Wang officiated at Wenming burial.', 's0404 names太尉司馬望奉祭 in the Taishi 4 funeral sequence.', 's0404', '司馬望'),
  mk('claim-176', 'research-blocked', 'Jin Emperor Yuan frugal early Jiangzuo tombs.', 's0406 reads江左初，元、明崇儉 without Taixing 1 on the line.', 's0406', '元、明'),
  mk('claim-177', 'research-blocked', 'Jin Emperor Ming frugal early Jiangzuo tombs.', 'The same s0406 passage names Ming with Yuan but supplies no Taining/Taixing year.', 's0406', '明崇儉'),
  mk('claim-178', 'supported', 'Empress Du of Cheng died in Xiankang 7.', 's0407 gives成帝咸康七年，皇后杜氏崩 explicitly.', 's0407', '咸康七年'),
  mk('claim-179', 'supported', 'Emperor Cheng in the Xiankang 7 Du empress funeral.', 's0407 anchors Duke Cheng at the 咸康七年 Du empress death edict cluster.', 's0407', '成帝'),
  mk('claim-180', 'research-blocked', 'Cai Mo on funeral gate ritual forms.', 's0412 discusses蔡謨说 on凶门 ritual without 咸康七年 on this line.', 's0412', '蔡謨'),
  mk('claim-181', 'research-blocked', 'Fan Jian on funeral gate ritual forms.', 's0415 gives范堅 commentary in the same funeral-form debate without a reign year witness.', 's0415', '范堅'),
  mk('claim-182', 'supported', 'Emperor Xiaowu’s empress Wang died in Taiyuan 4 month 9.', 's0420 states孝武帝太元四年九月，皇后王氏崩.', 's0420', '太元四年'),
  mk('claim-183', 'supported', 'Empress Wang of Xiaowu in the Taiyuan 4 funeral edicts.', 'The same s0420 line dates Empress Wang’s death with explicit Taiyuan 4 precision.', 's0420', '皇后王氏崩'),
  mk('claim-184', 'supported', 'Han Emperor Guangwu cited in suburban sacrifice schedule.', 's0426 describes汉光武-era五供 sacrifice routing; AD 57 is historical framing.', 's0426', '南郊'),
  mk('claim-185', 'supported', 'Wei Prince of Qi visited Gaoping tomb before Zhuge coup.', 's0433 narrates齊王在位九年，始一謁高平陵而曹爽誅 as Wei historical context.', 's0433', '高平陵'),
  mk('claim-186', 'supported', 'Cao Shuang executed after Qi prince tomb visit narrative.', 's0433 pairs曹爽誅 with the Qi prince’s lone tomb visit in the Wei visitation history.', 's0433', '曹爽誅'),
  mk('claim-187', 'supported', 'Emperor Hui restricted imperial tomb visits.', 's0436 traces武帝至惠帝谒陵 limits including惠帝復止.', 's0436', '惠帝復止'),
  mk('claim-188', 'supported', 'Eastern Jin began public mausoleum petitions after Yuan-di’s death.', 's0437 states元帝崩後，諸公始有謁陵辭告.', 's0437', '元帝崩後'),
  mk('claim-189', 'supported', 'Emperor Cheng era halted empress annual tomb visits.', 's0439 records成帝時中宮年年拜陵議止.', 's0439', '成帝時'),
  mk('claim-190', 'supported', 'Emperor Mu era with Chu dowager regent tomb visits.', 's0440 gives穆帝時，褚太后臨朝，又拜陵 for the regency context.', 's0440', '穆帝時'),
  mk('claim-191', 'supported', 'Empress Dowager Chu regent during Mu-era tomb visits.', 'The same s0440 line names褚太后臨朝 with clear person identity.', 's0440', '褚太后'),
  mk('claim-192', 'supported', 'Emperor Xiaowu’s death and Dao-zi’s tomb-visit proposal.', 's0441 opens with孝武崩 and Sima Daozi’s weekly tomb observance proposal.', 's0441', '孝武崩'),
  mk('claim-193', 'supported', 'Sima Daozi as commander proposing post-Xiaowu tomb visits.', 's0441 names驃騎將軍司馬道子 with unambiguous attribution.', 's0441', '司馬道子'),
  mk('claim-194', 'supported', 'Huan Qian memorialized in Yuanxing 1 on tomb visits.', 's0443 gives安帝元興元年 and Huan Qian’s memorial explicitly.', 's0443', '元興元年'),
  mk('claim-195', 'supported', 'Huan Qian as Left Vice Director in Yuanxing 1 tomb debate.', 's0443 names尚書左僕射桓謙 in the dated memorial.', 's0443', '桓謙奏'),
  mk('claim-196', 'supported', 'Emperor Wu’s edict cited against routine tomb visits.', 's0444 quotes武皇帝詔 on forbidding princes and officials from tomb visits.', 's0444', '武皇帝詔'),
  mk('claim-197', 'supported', 'Zheng Mo’s mother funeral led to three-year minister mourning rule.', 's0448 gives太康七年，大鴻臚鄭默母喪 and the resulting statute explicitly.', 's0448', '太康七年'),
  mk('claim-198', 'supported', 'Yuankang-era officials still had mourning powers curtailed.', 's0449 states元康中，陳準、傅咸 with contextual Yuankang-period precision.', 's0449', '元康中'),
  mk('claim-199', 'supported', 'Prince of Dongping introduced Wang Chang’s family history.', 's0450 opens東平王楙上言 with Wang Bi and Wang Chang’s parentage narrative.', 's0450', '東平王楙'),
  mk('claim-200', 'supported', 'Wang Chang’s father Wang Bi remarried after separation from first family.', 's0450 names王昌父毖 and the remarriage circumstances with clear actors.', 's0450', '王昌父毖'),
  mk('claim-201', 'supported', 'Dongping prince’s chancellor in the Wang Chang case.', 'Wang Mao’s memorial at s0450 frames the ministerial debate that follows.', 's0450', '相王昌'),
  mk('claim-202', 'research-blocked', 'Acting erudite Xie Heng on Wang Chang stepmother mourning.', 'Xie Heng argues at s0452 in the Wang Chang debate without Taikang 2 on the line.', 's0452', '謝衡議'),
  mk('claim-203', 'research-blocked', 'Acting erudite Xu Meng opposing mutual mourning.', 'Xu Meng’s view at s0453 lacks a sourced Taikang year label.', 's0453', '許猛以為'),
  mk('claim-204', 'research-blocked', 'Cavalier attendant Liu Zhi-an on Wang Chang case.', 'Liu speaks at s0456 without Taikang 2 in Chinese.', 's0456', '劉智安議'),
  mk('claim-205', 'research-blocked', 'Capital clerk Yu Pu on dual-primary wives issue.', 'Yu Pu argues at s0459; Taikang 2 is table-only for this memorial.', 's0459', '虞溥議'),
  mk('claim-206', 'research-blocked', 'Qin Xiu on Wang Chang mutual mourning.', 'Qin Xiu’s memorial at s0463 is undated on the cited line.', 's0463', '秦秀議'),
  mk('claim-207', 'supported', 'Han official cited in Wang Chang precedent discussion.', 's0471 cites黃昌 historical case as comparative law; AD 100 is allusive.', 's0471', '黃昌'),
  mk('claim-208', 'supported', 'Duke Wen of Jin’s daughter in Ji-surname mourning parallel.', 's0472 references姬氏之讓 in the Wang Chang argument chain.', 's0472', '姬氏'),
  mk('claim-209', 'research-blocked', 'Director Cui Liang and peers on Wang Chang case.', 'Senior officials align at s0473 without Taikang 2 on the memorial line.', 's0473', '荀勖'),
  mk('claim-210', 'research-blocked', 'Shan Xiong and Chen Shou opposing Yu Pu.', 's0474 records Shan Xiong and Chen Shou without a reign-year witness.', 's0474', '山雄'),
  mk('claim-211', 'research-blocked', 'Chen Shou as historian-attendant in Wang Chang debate.', 'Chen Shou speaks in the same s0474 unit without sourced Taikang year.', 's0474', '陳壽以為'),
  mk('claim-212', 'research-blocked', 'Thieves-section clerk Bian Cui on Wang Chang remarriage.', 'Bian Cui argues at s0478 in the debate cluster; Taikang 2 not on the line.', 's0478', '卞粹議'),
];

const newItemChecks = [...batchA, ...batchB];

const mergedChecks = [...prior.itemChecks];
const seen = new Set(prior.itemChecks.map((c) => c.id));
for (const c of newItemChecks) {
  if (seen.has(c.id)) throw new Error(`Duplicate ${c.id}`);
  mergedChecks.push(c);
  seen.add(c.id);
}

const newPeople = {
  p146: { verdict: 'supported', event: 'Emperor Wu in ministerial mourning-music policy.', reason: '武帝詔 appears across s0333 and s0351 in the three-day versus month music rules.', evidence: [quote('s0333', '武帝')] },
  p153: { verdict: 'supported', event: 'Emperor Yuan in Guangchang aunt mourning episode.', reason: '元帝姨 is explicit at s0334.', evidence: [quote('s0334', '元帝')] },
  p155: { verdict: 'supported', event: 'He Xun in Eastern Jin mourning-music debate.', reason: '賀循 at s0341 replies in the Guangchang sequence.', evidence: [quote('s0341', '賀循')] },
  p172: { verdict: 'supported', event: 'Wei Emperor Wen in frugal burial narrative.', reason: '文帝 at s0390 follows Wu’s burial austerity measures.', evidence: [quote('s0390', '文帝')] },
  p167: { verdict: 'supported', event: 'Jin Emperor Wu at Wenming Taishi 4 burial.', reason: '武帝泰始四年 anchors s0404.', evidence: [quote('s0404', '武帝')] },
  p195: { verdict: 'supported', event: 'Wang Chang in stepmother mourning controversy.', reason: '王昌父毖 and Wang Chang’s parentage are explicit at s0450.', evidence: [quote('s0450', '王昌')] },
};

const personChecks = [...prior.personChecks];
const pseen = new Set(prior.personChecks.map((p) => p.id));
for (const [id, body] of Object.entries(newPeople)) {
  if (!pseen.has(id)) {
    personChecks.push({ id, ...body });
    pseen.add(id);
  }
}

const newFindings = [
  { items: ['claim-151'], problem: 'Guangchang aunt mourning at s0334 lacks Taixing 1 on the Chinese line.', action: 'Drop Taixing year until a memorial supplies an explicit reign date; keep Yuan-di context only.' },
  { items: ['claim-159'], problem: 'Claim names Chamberlain Che Yin but s0349 witness is Grand Secretary Wang Biao-zhi.', action: 'Owner: reassign person to Wang Biao-zhi or cite a Che Yin unit; remove misattached Shengping interval from wrong witness.' },
  { items: ['claim-162', 'claim-163'], problem: 'Zhi Yu reform units s0357–s0372 lack Taian 1 on cited lines.', action: 'Treat as undated ritual-reform argumentation unless an earlier dated anchor is chained in text.' },
  { items: ['claim-169'], problem: 'Ming-di discussion at s0400 has no AD 230 or reign year.', action: 'Defer Western year; person reference may stand without calendar precision.' },
  { items: ['claim-176', 'claim-177'], problem: 'Jiangzuo Yuan/Ming thrift narrative at s0406 is undated.', action: 'Hold Taixing/Taining table labels until a dated unit is cited.' },
  { items: ['claim-180', 'claim-181'], problem: 'Cai Mo and Fan Jian funeral-gate debate lacks Xiankang 7 on s0412 and s0415.', action: 'Do not attach Xiankang 7 from a separate empress-death line without cross-citation in the packet.' },
  { items: ['claim-202', 'claim-203', 'claim-204', 'claim-205', 'claim-206', 'claim-209', 'claim-210', 'claim-211', 'claim-212'], problem: 'Wang Chang stepmother debate memorials lack Taikang 2 on Chinese lines despite 太康七年 nearby at s0448.', action: 'Keep persons supported; block Taikang 2 Western intervals unless owner cites a dated opening memorial.' },
];

const findings = [...prior.findings, ...newFindings];

const reviewedUnits = [...prior.reviewedUnits];
for (let n = 321; n <= 480; n++) {
  const u = `s${String(n).padStart(4, '0')}`;
  if (!reviewedUnits.includes(u)) reviewedUnits.push(u);
}

const spanG5 = [];
for (let n = 321; n <= 400; n++) spanG5.push(`s${String(n).padStart(4, '0')}`);
const spanG6 = [];
for (let n = 401; n <= 480; n++) spanG6.push(`s${String(n).padStart(4, '0')}`);

const checksG5 = newItemChecks.filter((c) => c.evidence.some((e) => spanG5.includes(e.unit))).map((c) => c.id);
const checksG6 = newItemChecks.filter((c) => c.evidence.some((e) => spanG6.includes(e.unit))).map((c) => c.id);

const priorSpans = prior.reviewContext.coverage.spanCheckpoints ?? [];
const uniqueClaimIds = new Set(mergedChecks.filter((c) => c.id.startsWith('claim-')).map((c) => c.id));

const report = {
  ...prior,
  reviewedAt: new Date().toISOString(),
  summary:
    'Native partial chronology through s0480 on draft #5488. Prior 125 item checks preserved. New spans: Che Yin ministry closure and mourning-music catalogue (s0321–s0354), Zhi Yu ritual reforms and Wei–Jin funeral history (s0355–s0400), Jiangzuo tomb practice and visitation law (s0401–s0448), Wang Chang stepmother mourning debate (s0449–s0480). Not chapter approval.',
  reviewContext: {
    ...prior.reviewContext,
    nextSpan: { startUnit: 's0481', endUnit: 's0560', label: 'Wang Chang debate close and late ritual codification' },
    coverage: {
      ...prior.reviewContext.coverage,
      reviewedUnits: reviewedUnits.length,
      uniqueItemChecks: mergedChecks.length,
      uniqueClaimsChecked: uniqueClaimIds.size,
      preservedEnglishRepairs: 97,
      preservedCandidateDispositions: 38,
      nextUntouchedSpan: {
        startUnit: 's0481',
        endUnit: 's0560',
        label: 'Residual Wang Chang memorials and late-chapter ritual entries',
      },
      spanCheckpoints: [
        ...priorSpans,
        { span: 's0321-s0400', newItemChecks: checksG5.length, itemIds: checksG5.sort() },
        { span: 's0401-s0480', newItemChecks: checksG6.length, itemIds: checksG6.sort() },
      ],
    },
  },
  reviewedUnits,
  itemChecks: mergedChecks,
  personChecks,
  findings,
  references: [
    ...prior.references,
    {
      kind: 'internal',
      book: 'jinshu',
      chapter: '020',
      unit: 's0326',
      quote: '聽胤所上',
      sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0326').zh).digest('hex')}`,
      reason: 'Che Yin tertiary-son mourning reform accepted by ministry.',
    },
    {
      kind: 'internal',
      book: 'jinshu',
      chapter: '020',
      unit: 's0404',
      quote: '泰始四年',
      sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0404').zh).digest('hex')}`,
      reason: 'Wenming empress Taishi 4 burial anchor.',
    },
    {
      kind: 'internal',
      book: 'jinshu',
      chapter: '020',
      unit: 's0448',
      quote: '太康七年',
      sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0448').zh).digest('hex')}`,
      reason: 'Zheng Mo funeral statute anchor before Wang Chang debate.',
    },
  ],
};

validateDateAuditReport(report, pin);

const out = `${ART}/date-audit-report-partial-s0037-s0480.json`;
fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);

const checkpoint = (label, start, end, ids) => ({
  schemaVersion: 1,
  kind: 'jinshu020-chronology-span-checkpoint',
  draftCommit: prior.reviewContext.draftCommit,
  span: { startUnit: start, endUnit: end, label },
  preservedPriorThrough: 's0320',
  preservedItemChecks: 125,
  newItemCheckIds: ids.sort(),
  newItemCheckCount: ids.length,
  cumulativeReviewedUnits: reviewedUnits.length,
  cumulativeItemChecks: mergedChecks.length,
  cumulativeUniqueClaimsChecked: uniqueClaimIds.size,
  nextUntouchedSpan: report.reviewContext.coverage.nextUntouchedSpan,
  notChapterApproval: true,
});

fs.writeFileSync(
  `${ART}/chronology-span-checkpoint-s0321-s0400.json`,
  `${JSON.stringify(checkpoint('Ministry closure, mourning music, Zhi Yu reforms, Wei–Jin funeral opening', 's0321', 's0400', checksG5), null, 2)}\n`,
);
fs.writeFileSync(
  `${ART}/chronology-span-checkpoint-s0401-s0480.json`,
  `${JSON.stringify(checkpoint('Jiangzuo tombs, visitation law, Wang Chang stepmother debate', 's0401', 's0480', checksG6), null, 2)}\n`,
);

console.log(
  JSON.stringify(
    {
      out,
      reviewedUnits: reviewedUnits.length,
      itemChecks: mergedChecks.length,
      uniqueClaimsChecked: uniqueClaimIds.size,
      g5: checksG5.length,
      g6: checksG6.length,
    },
    null,
    2,
  ),
);