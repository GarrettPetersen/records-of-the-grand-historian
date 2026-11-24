#!/usr/bin/env node
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readJson } from '../../../scripts/lib/people-content.mjs';
import { buildDateAuditPacket, validateDateAuditReport } from '../../../scripts/lib/people-date-audit.mjs';

const ROOT = '/agent/repos/records-of-the-grand-historian';
const ART = `${ROOT}/research/people/jinshu020-cloud-authoring-20261123`;
const prior = readJson(`${ART}/date-audit-report-partial-s0037-s0095.json`);
const pin = readJson(`${ART}/date-audit-packet-post-editorial-pin.json`);
const packet = pin.units?.length ? pin : buildDateAuditPacket('jinshu', '020', {
  extraction: readJson(`${ROOT}/data/people/extractions/jinshu/020.json`),
  dataDir: ROOT
});
const unitMap = new Map(packet.units.map(u => [u.id, u]));

const newItemChecks = [
  { id: 'claim-36', verdict: 'supported', event: 'Erudite Xie You in the Ningkang 2 intercalary-mourning debate.', reason: 'Xie You is named at s0096 with Lu ceremonial precedent; the debate immediately follows 寧康二年簡文崩, so Ningkang 2 contextual dating is warranted.', evidence: [{ unit: 's0096', quote: '博士謝攸' }] },
  { id: 'claim-37', verdict: 'supported', event: 'Erudite Kong Can in the Ningkang 2 intercalary-mourning debate.', reason: 'Kong Can is named with Xie You at s0096; the same Ningkang 2 procedural context applies without a separate year on the line.', evidence: [{ unit: 's0096', quote: '孔粲議' }] },
  { id: 'claim-38', verdict: 'supported', event: 'Duke of Lu cited via Spring and Autumn chronology at s0096.', reason: 'The Lu Xiang 28 intercalary example is historical allusion; BC dating is interpretive and does not assert a Jin reign year.', evidence: [{ unit: 's0096', quote: '魯襄二十八年' }] },
  { id: 'claim-39', verdict: 'incorrect', event: 'Erudite Wu Shang cited for intercalary xiang (auspicious completion) practice.', reason: 's0097 names Wu Shang without Yongkang 1; attaching Yongkang 1 is table-only and not supported on the cited line.', evidence: [{ unit: 's0097', quote: '博士吳商' }] },
  { id: 'claim-40', verdict: 'supported', event: 'Vice Director Xie An joined the Ningkang-era intercalary consensus.', reason: 'Xie An appears in the s0098 memorial list in the debate following 寧康二年七月簡文崩; contextual Ningkang 2 is precise enough.', evidence: [{ unit: 's0098', quote: '尚書僕射謝安' }] },
  { id: 'claim-41', verdict: 'supported', event: 'Central army commander Wang Shao in the intercalary consensus list.', reason: 'Wang Shao is clearly named at s0098 within the same Ningkang 2 mourning procedure debate.', evidence: [{ unit: 's0098', quote: '中領軍王劭' }] },
  { id: 'claim-42', verdict: 'supported', event: 'Cavalier attendant Zheng Xi in the intercalary consensus.', reason: 'Zheng Xi is identified at s0098 and again speaks at s0103 on Zhongzong/Suzu intercalary precedents.', evidence: [{ unit: 's0098', quote: '散騎常侍鄭襲' }] },
  { id: 'claim-43', verdict: 'supported', event: 'General of the Right Guard Yin Kang in the intercalary debate.', reason: 'Yin Kang is named at s0098 and argues at s0099 on overdue versus on-time xiang timing.', evidence: [{ unit: 's0099', quote: '康曰' }] },
  { id: 'claim-44', verdict: 'supported', event: 'Valiant Cavalry General Yuan Hong in the intercalary debate.', reason: 'Yuan Hong is in the s0098 list and states his intercalary-month view at s0101.', evidence: [{ unit: 's0101', quote: '宏曰' }] },
  { id: 'claim-45', verdict: 'supported', event: 'Cavalier gentleman Yuan Mao in the consensus list.', reason: 'Yuan Mao is named only in the collective agreement list at s0098 with clear Chinese attribution.', evidence: [{ unit: 's0098', quote: '散騎侍郎殷茂' }] },
  { id: 'claim-46', verdict: 'supported', event: 'Secretariat gentleman Che Yin in the consensus list.', reason: 'Che Yin appears in the collective agreement at s0098 without date contradiction.', evidence: [{ unit: 's0098', quote: '中書郎車胤' }] },
  { id: 'claim-47', verdict: 'supported', event: 'Left assistant director Liu Zun in the consensus list.', reason: 'Liu Zun is named at s0098 as part of the same intercalary xiang deliberation.', evidence: [{ unit: 's0098', quote: '左丞劉遵' }] },
  { id: 'claim-48', verdict: 'supported', event: 'Gentleman of the Ministry of Personnel Liu Dan in the consensus list.', reason: 'Liu Dan is named at s0098 within the Ningkang-era intercalary debate cluster.', evidence: [{ unit: 's0098', quote: '吏部郎劉耽' }] },
  { id: 'claim-49', verdict: 'supported', event: 'Director Wang Biao-zhi dissents on Wu Shang authority.', reason: 'Wang Biao-zhi leads the dissenting memorial at s0106 during the same intercalary controversy.', evidence: [{ unit: 's0106', quote: '尚書令王彪之' }] },
  { id: 'claim-50', verdict: 'supported', event: 'Prince of Qiao Wang Hun among dissenting memorialists.', reason: 'Wang Hun is named with other dissenters at s0106 in the intercalary debate.', evidence: [{ unit: 's0106', quote: '侍中王混' }] },
  { id: 'claim-51', verdict: 'incorrect', event: 'Chancellor Huan cited on the twenty-five-month da-xiang rule.', reason: 's0108 cites 丞相桓公 without a reign year; Ningkang 1 is external inference, not source text.', evidence: [{ unit: 's0108', quote: '丞相桓公' }] },
  { id: 'claim-52', verdict: 'incorrect', event: 'Xu Guang’s methodological commentary in the intercalary controversy.', reason: 's0117 titles 徐廣論 without Long\'an 4; attaching that reign year is table-only for this essay unit.', evidence: [{ unit: 's0117', quote: '徐廣論' }] },
  { id: 'claim-19', verdict: 'supported', event: 'Wei Wu cited for mourning versus music practice.', reason: 's0121 narrates Cao Cao’s first-month death as historical precedent; AD 220 is allusive Western framing, not a Jin event date.', evidence: [{ unit: 's0121', quote: '魏武以正月崩' }] },
  { id: 'claim-53', verdict: 'supported', event: 'Wei Emperor Wen allowed music in the seventh month after Wu’s death.', reason: 'The same s0121 line pairs Wen’s seventh-month music with Wu’s death narrative as explicit historical chronology.', evidence: [{ unit: 's0121', quote: '魏文以其年七月設妓樂百戲' }] },
  { id: 'claim-54', verdict: 'supported', event: 'Emperor Hui suspended New Year music during crown-prince mourning.', reason: 's0123 gives 惠帝太安元年 explicitly for the unremoved crown-prince mourning at the yuanhui.', evidence: [{ unit: 's0123', quote: '惠帝太安元年' }] },
  { id: 'claim-55', verdict: 'research-blocked', event: 'Empress-dowager regency and Chu Pou’s death ending yuanhui music.', reason: 's0125 states regency and Chu Pou’s death without 永和五年 or another reign year; Yonghe 5 is not anchored on this line.', evidence: [{ unit: 's0125', quote: '后父褚裒薨' }] },
  { id: 'claim-56', verdict: 'supported', event: 'Emperor Xiaowu suspended music for Empress Wang’s mourning.', reason: 's0126 gives 孝武太元六年 for the empress mourning music suspension; s0127 孝武崩 bounds Xiaowu’s end in this narrative cluster.', evidence: [{ unit: 's0126', quote: '孝武太元六年' }, { unit: 's0127', quote: '孝武崩' }] },
  { id: 'claim-57', verdict: 'supported', event: 'Empress Wang mourning under Xiaowu in Taiyuan 6.', reason: 's0126 links Empress Wang’s mourning directly to 太元六年 with explicit reign-year precision.', evidence: [{ unit: 's0126', quote: '皇后王氏喪' }] },
  { id: 'claim-58', verdict: 'supported', event: 'Grand Tutor Sima Daozi proposed post-Xiaowu marriage and music limits.', reason: 's0127 opens with 孝武崩 and Daozi’s memorial on post-山地 restrictions, anchoring Taiyuan-era Xiaowu death context.', evidence: [{ unit: 's0127', quote: '太傅錄尚書會稽王道子' }] },
  { id: 'claim-59', verdict: 'supported', event: 'Han Emperor Wendi cited for shortened mourning and immediate auspicious rites.', reason: 's0137 and s0142 cite Han Wendi’s expedient mourning reform as historical precedent without misdating Jin events.', evidence: [{ unit: 's0137', quote: '漢文帝' }] },
  { id: 'claim-60', verdict: 'supported', event: 'Shang King Gaozong cited in Du Yu’s expedited-mourning argument.', reason: 's0149 cites Gaozong 諒闇 as ritual precedent; BC hints are interpretive allusion only.', evidence: [{ unit: 's0149', quote: '高宗' }] },
  { id: 'claim-62', verdict: 'supported', event: 'Empress Wu-yuan Yang died in Taishi 10.', reason: 's0130 explicitly gives 泰始十年 and 武元楊皇后崩 with funeral practice described.', evidence: [{ unit: 's0130', quote: '泰始十年，武元楊皇后崩' }] },
  { id: 'claim-63', verdict: 'supported', event: 'Crown prince (later Hui) followed reduced mourning per Zhang Jing.', reason: 's0131–s0133 tie the crown prince to the Taishi-era palace mourning reform debate.', evidence: [{ unit: 's0131', quote: '皇太子' }] },
  { id: 'claim-64', verdict: 'supported', event: 'Erudite Zhang Jing proposed crown-prince mourning reduction.', reason: 's0131 names Zhang Jing’s memorial as the basis for crown-prince dress release in the Taishi 10 cluster.', evidence: [{ unit: 's0131', quote: '博士張靖' }] },
  { id: 'claim-65', verdict: 'supported', event: 'Erudite Chen Kui argued crown prince should complete full mourning.', reason: 's0132 records Chen Kui’s dissent that the crown prince lacked state affairs and should keep full mourning.', evidence: [{ unit: 's0132', quote: '博士陳逵' }] },
  { id: 'claim-66', verdict: 'supported', event: 'Minister Lu Qin questioned Du Yu’s evidence.', reason: 's0145 names Lu Qin seeking Du Yu’s proofs in the Taishi 10 crown-prince mourning controversy.', evidence: [{ unit: 's0145', quote: '尚書僕射盧欽' }] },
  { id: 'claim-67', verdict: 'supported', event: 'Vice Director Wei Shu questioned Du Yu with Lu Qin.', reason: 's0145 pairs Wei Shu with Lu Qin in requesting Du Yu’s textual proofs.', evidence: [{ unit: 's0145', quote: '尚書魏舒' }] },
  { id: 'claim-68', verdict: 'supported', event: 'Du Yu as Baron of Juyang argued expedited royal mourning.', reason: 's0135 introduces Du Yu’s view and s0145 continues the proof exchange in the same Taishi 10 debate.', evidence: [{ unit: 's0135', quote: '尚書杜預' }] },
  { id: 'claim-69', verdict: 'supported', event: 'Zichan / Spring and Autumn cited for post-burial liang' }, 
];

// fix claim-69 - incomplete
newItemChecks[newItemChecks.length - 1] = {
  id: 'claim-69',
  verdict: 'supported',
  event: 'Shuxiang cited on post-burial mourning and music timing.',
  reason: 's0148 and s0150 use Shuxiang and King Jing anecdotes as Spring and Autumn precedent; BC dating is allusive.',
  evidence: [{ unit: 's0148', quote: '叔向' }]
};

newItemChecks.push(
  { id: 'claim-70', verdict: 'supported', event: 'Duke of Zhou cited for liang\'an versus heart-mourning wording.', reason: 's0149 contrasts Duke of Zhou’s 諒闇三年 phrasing with expedited dress removal; BC frame is ritual allusion.', evidence: [{ unit: 's0149', quote: '周公' }] },
  { id: 'claim-71', verdict: 'supported', event: 'King Jing of Zhou cited for early post-mourning feasting.', reason: 's0150 cites King Jing via Shuxiang for violating liang\'an before removal; BC dating is historical citation.', evidence: [{ unit: 's0150', quote: '景王' }] },
  { id: 'claim-61', verdict: 'supported', event: 'Confucius cited on ritual损益 across generations.', reason: 's0158 quotes Confucius on hundred-generation ritual change as proof text, not a dated Jin event.', evidence: [{ unit: 's0158', quote: '仲尼曰' }] },
  { id: 'claim-72', verdict: 'supported', event: 'Zichan as Zheng minister in the Jin marquis anecdote.', reason: 's0151 narrates Zichan attending while Duke Jian’s burial was pending; BC context is explicit Spring and Autumn citation.', evidence: [{ unit: 's0151', quote: '子產相鄭伯' }] },
  { id: 'claim-73', verdict: 'supported', event: 'Duke Jian of Jin in the pre-burial feast anecdote.', reason: 's0151 references 簡公未葬; the Jin ruler is the dated narrative subject within the BC anecdote.', evidence: [{ unit: 's0151', quote: '簡公未葬' }] },
  { id: 'claim-74', verdict: 'supported', event: 'Zai Xu in the Lu mourning-gift anecdote.', reason: 's0152 cites Zai Xu and the Commentary line as classical proof for post-burial liang\'an practice.', evidence: [{ unit: 's0152', quote: '宰咺' }] },
  { id: 'claim-75', verdict: 'supported', event: 'Duke Hui of Lu in the mourning-gift anecdote.', reason: 's0152 pairs the Lu ruler with Zai Xu’s gift narrative as Spring and Autumn evidence.', evidence: [{ unit: 's0152', quote: '惠公' }] },
  { id: 'claim-76', verdict: 'supported', event: 'Jia Chong memorializing the Taishi 10 crown-prince mourning decision.', reason: 's0159 lists Jia Chong leading the formal memorial after the Du Yu debate in the Taishi 10 reform sequence.', evidence: [{ unit: 's0159', quote: '賈充' }] },
  { id: 'claim-77', verdict: 'supported', event: 'Shan Tao as minister signing the Taishi 10 memorial.', reason: 's0159 names Shan Tao among signatories on the crown-prince mourning reform memorial.', evidence: [{ unit: 's0159', quote: '山濤' }] },
  { id: 'claim-78', verdict: 'supported', event: 'Hu Wei signing the Taishi 10 reform memorial.', reason: 'Hu Wei is listed at s0159 with other ministers formalizing Zhang Jing’s reduced-mourning proposal.', evidence: [{ unit: 's0159', quote: '胡威' }] },
  { id: 'claim-79', verdict: 'supported', event: 'Shi Jian signing the Taishi 10 reform memorial.', reason: 'Shi Jian appears in the s0159 signatory list immediately following the Taishi 10 debate cluster.', evidence: [{ unit: 's0159', quote: '石鑒' }] },
  { id: 'claim-97', verdict: 'supported', event: 'Du Yu defended expedited mourning before the formal memorial.', reason: 's0161, s0163–s0164 describe Du Yu’s argument and commissioning Duan Chang’s proofs after the Taishi 10 controversy.', evidence: [{ unit: 's0163', quote: '預亦不自解說' }] },
  { id: 'claim-98', verdict: 'supported', event: 'Erudite Duan Chang compiled evidence for Du Yu.', reason: 's0164 states Duan Chang gathered classical citations under Du Yu’s direction in the Taishi 10 proof effort.', evidence: [{ unit: 's0164', quote: '暢承預旨' }] },
  { id: 'claim-99', verdict: 'supported', event: 'Empress Yang fostered Emperor Huai and was mourned posthumously.', reason: 's0167 narrates Yang empress nurturing Huai and court debate on the emperor’s mourning dress at her burial.', evidence: [{ unit: 's0167', quote: '武帝楊悼皇后' }] },
  { id: 'claim-100', verdict: 'research-blocked', event: 'Emperor Wu and Western Jin span attached to the Yang empress foster narrative.', reason: 's0167 centers Yang empress and Huai’s youth; Taixi–Yongjia Western interval is not spelled out on the cited units.', evidence: [{ unit: 's0167', quote: '懷帝' }] },
  { id: 'claim-101', verdict: 'research-blocked', event: 'Emperor Huai’s accession year in the foster-mourning episode.', reason: 'Huai is named at s0167 but Yongjia 1 is not stated on that line for his enthronement date.', evidence: [{ unit: 's0167', quote: '即位' }] },
  { id: 'claim-102', verdict: 'supported', event: 'Luqiu Chong proposed plain dress only at the Yang empress burial.', reason: 's0169 records Luqiu Chong’s view that the emperor need only three audiences in plain dress at burial day.', evidence: [{ unit: 's0169', quote: '閭丘沖' }] },
  { id: 'claim-103', verdict: 'supported', event: 'Emperor Kang’s mourning calendar for Empress Du’s death anniversary.', reason: 's0173 gives 康帝建元元年正月晦 and 成恭杜皇后周忌 with explicit reign dating.', evidence: [{ unit: 's0173', quote: '康帝建元元年' }] },
  { id: 'claim-104', verdict: 'supported', event: 'Empress Du as Cheng’s consort in the Kangdi memorial.', reason: 's0173 names 成恭杜皇后 in the anniversary memorial with clear identity and 建元元年 dating.', evidence: [{ unit: 's0173', quote: '成恭杜皇后' }] },
  { id: 'claim-105', verdict: 'supported', event: 'Emperor Ai sought heavier mourning for Zhang imperial consort.', reason: 's0176 gives 興寧元年 and 章皇太妃薨 with Ai’s intent to wear heavy mourning stated.', evidence: [{ unit: 's0176', quote: '興寧元年' }] },
  { id: 'claim-106', verdict: 'supported', event: 'Jiang Bi advised on Xingning mourning dress for the imperial consort.', reason: 's0177 records Jiang Bi’s memorial in the 興寧元年 Zhang consort mourning sequence.', evidence: [{ unit: 's0177', quote: '江虨啟' }] },
  { id: 'claim-107', verdict: 'incorrect', event: 'Empress Dowager Chongde Chu died in Xiaowu’s Ningkang period.', reason: 's0180 reads 孝武甯康中，崇德太后褚氏崩; Taiyuan 9 is the wrong reign label for this 寧康 context.', evidence: [{ unit: 's0180', quote: '甯康中' }] },
  { id: 'claim-108', verdict: 'supported', event: 'Erudite Xu Zao debated Chu dowager kinship and mourning grade.', reason: 's0182 gives Xu Zao’s argument in the 寧康中 Chu dowager episode even though claim-107’s reign year label is wrong.', evidence: [{ unit: 's0182', quote: '博士徐藻' }] },
  { id: 'claim-109', verdict: 'research-blocked', event: 'Emperor Mu cited in Xiaowu’s sacrifice roster debate.', reason: 's0187 lists 康、穆、哀皇及靖后之祀 without a reign year on the line; Taiyuan 9 is not sourced here.', evidence: [{ unit: 's0187', quote: '穆' }] },
  { id: 'claim-110', verdict: 'research-blocked', event: 'Emperor Ai cited in the sacrifice roster debate.', reason: 's0187 names Ai among prior rulers venerated by Xiaowu but supplies no Taiyuan year for the debate.', evidence: [{ unit: 's0187', quote: '哀皇' }] },
  { id: 'claim-111', verdict: 'research-blocked', event: 'Empress Jing cited in Xiaowu’s ancestral service debate.', reason: 's0187 references 靖后 in the roster without dating the deliberation to Taiyuan 9.', evidence: [{ unit: 's0187', quote: '靖后' }] },
  { id: 'claim-112', verdict: 'research-blocked', event: 'Grand Empress Dowager Li’s Long\'an 4 death and Xiaowu parentage span.', reason: 's0191 gives 隆安四年，孝武太皇太后李氏崩; Taiyuan 21 as interval start is not on this line for the parentage claim.', evidence: [{ unit: 's0191', quote: '隆安四年' }] },
  { id: 'claim-113', verdict: 'supported', event: 'He Cheng as Left Vice Director in the Li grand-empress dowager debate.', reason: 's0192 lists He Cheng among ministers deliberating mourning for the Li grand-empress dowager after s0191’s dated death.', evidence: [{ unit: 's0192', quote: '尚書左僕射何澄' }] },
  { id: 'claim-114', verdict: 'supported', event: 'Wang Ya as Right Vice Director in the Li dowager debate.', reason: 's0192 names Wang Ya with He Cheng in the Long\'an-era mourning grade discussion.', evidence: [{ unit: 's0192', quote: '右僕射王雅' }] },
  { id: 'claim-115', verdict: 'supported', event: 'Che Yin as minister in the Li dowager deliberation.', reason: 'Che Yin appears at s0192 in the ministerial panel following 隆安四年 Li dowager death.', evidence: [{ unit: 's0192', quote: '尚書車胤' }] },
  { id: 'claim-116', verdict: 'supported', event: 'Kong Anguo as minister in the Li dowager deliberation.', reason: 'Kong Anguo is named at s0192 among officials arguing full ceremonial treatment.', evidence: [{ unit: 's0192', quote: '孔安國' }] },
  { id: 'claim-117', verdict: 'supported', event: 'Xu Guang as Sacrifices official in the Li dowager debate.', reason: 's0192 lists Xu Guang with the other ministers; Long\'an context comes from s0191, not a separate year on this line.', evidence: [{ unit: 's0192', quote: '徐廣議' }] },
  { id: 'claim-118', verdict: 'supported', event: 'Duke Wen of Lu cited for three-year mourning after ennobling his mother.', reason: 's0194 cites Duke Wen’s three-year mourning as Spring and Autumn precedent in the Li dowager argument.', evidence: [{ unit: 's0194', quote: '文公服三年之喪' }] },
  { id: 'claim-119', verdict: 'supported', event: 'Cheng Feng as Lu ducal lady in the same citation.', reason: 's0194 pairs Cheng Feng’s ennoblement with Duke Wen’s mourning as classical precedent.', evidence: [{ unit: 's0194', quote: '成風' }] },
  { id: 'claim-120', verdict: 'research-blocked', event: 'Empress Yong\'an mourning in the Hui-era sequence.', reason: 's0198 mentions Empress Yong\'an without 光熙元年 or another reign year; Guangxi 1 is not anchored on the cited line.', evidence: [{ unit: 's0198', quote: '永安皇后' }] },
  { id: 'claim-121', verdict: 'supported', event: 'Honored Lady Chen, mother of the crown prince, died in Taiyuan 15.', reason: 's0200 gives 孝武帝太元十五年，淑媛陳氏卒 with explicit reign year and crown-prince maternity.', evidence: [{ unit: 's0200', quote: '太元十五年' }] },
  { id: 'claim-122', verdict: 'supported', event: 'Emperor Xiaowu in the Taiyuan 15 Honored Lady Chen episode.', reason: 's0200 addresses Xiaowu’s mourning obligations for the crown prince’s mother with 太元十五年 dating.', evidence: [{ unit: 's0200', quote: '孝武帝' }] }
);

for (const check of newItemChecks) {
  for (const c of check.evidence) {
    const zh = unitMap.get(c.unit)?.zh ?? '';
    if (!zh.includes(c.quote)) throw new Error(`Quote mismatch ${check.id} ${c.unit} ${c.quote}`);
  }
}

const mergedChecks = [...prior.itemChecks];
const seen = new Set(prior.itemChecks.map(c => c.id));
for (const c of newItemChecks) {
  if (seen.has(c.id)) throw new Error(`Duplicate check ${c.id}`);
  mergedChecks.push(c);
  seen.add(c.id);
}

const newPeople = {
  p036: { verdict: 'supported', event: 'Erudite Xie You in Ningkang intercalary debate.', reason: 'Named at s0096 as a principal speaker on Lu intercalary precedent in the Ningkang 2 mourning controversy.', evidence: [{ unit: 's0096', quote: '謝攸' }] },
  p039: { verdict: 'supported', event: 'Erudite Wu Shang cited for intercalary xiang practice.', reason: 'Wu Shang is named at s0097; only the Yongkang year label on the linked claim is unsupported.', evidence: [{ unit: 's0097', quote: '吳商' }] },
  p049: { verdict: 'supported', event: 'Wang Biao-zhi dissenting on Wu Shang’s authority.', reason: 'Identified at s0106 as Grand Secretary leading memorialists who reject Wu Shang as precedent.', evidence: [{ unit: 's0106', quote: '王彪之' }] },
  p051: { verdict: 'supported', event: 'Huan Wen cited on da-xiang timing.', reason: 'Huan Wen is named at s0108; person reference is clear while reign-year attachment is incorrect on the claim.', evidence: [{ unit: 's0108', quote: '桓公' }] },
  p052: { verdict: 'supported', event: 'Xu Guang as methodological commentator.', reason: 'Xu Guang is named at s0117 in the intercalary methodological exchange.', evidence: [{ unit: 's0117', quote: '徐廣' }] },
  p054: { verdict: 'supported', event: 'Emperor Hui in Taian-era crown-prince mourning music suspension.', reason: '惠帝 and 太安元年 appear at s0123 with unambiguous identity for the music suspension episode.', evidence: [{ unit: 's0123', quote: '惠帝' }] },
  p055: { verdict: 'supported', event: 'Chu Pou as empress dowager\'s father whose death stopped yuanhui music.', reason: '褚裒 is named at s0125; year labeling remains blocked on the linked claim.', evidence: [{ unit: 's0125', quote: '褚裒' }] },
  p056: { verdict: 'supported', event: 'Emperor Xiaowu across Taiyuan-era mourning and music examples.', reason: '孝武 appears at s0126–s0127 and s0200 with consistent identity across reviewed spans.', evidence: [{ unit: 's0126', quote: '孝武' }] },
  p063: { verdict: 'supported', event: 'Crown prince (later Hui) in Taishi 10 mourning reform.', reason: '皇太子 is central at s0131–s0133 in the Taishi 10 palace mourning reform debate.', evidence: [{ unit: 's0131', quote: '皇太子' }] },
  p066: { verdict: 'supported', event: 'Du Yu arguing expedited royal mourning.', reason: '杜預 is named at s0135 and pursued at s0145–s0164 in the Taishi 10 proof controversy.', evidence: [{ unit: 's0135', quote: '杜預' }] },
  p097: { verdict: 'supported', event: 'Du Yu in follow-up proof phase after memorial.', reason: 'Du Yu’s continued defense and commissioning of proofs appears at s0163–s0164.', evidence: [{ unit: 's0163', quote: '預' }] },
  p103: { verdict: 'supported', event: 'Emperor Kang in the Jianyuan mourning memorial.', reason: '康帝 is explicit in the 建元元年 memorial at s0173.', evidence: [{ unit: 's0173', quote: '康帝' }] },
  p107: { verdict: 'supported', event: 'Chongde Empress Dowager Chu in Ningkang-era Xiaowu mourning.', reason: '崇德太后褚氏 is named at s0180; linked claim used wrong Taiyuan year label.', evidence: [{ unit: 's0180', quote: '崇德太后褚氏' }] },
  p112: { verdict: 'supported', event: 'Grand Empress Dowager Li in Long\'an 4 mourning deliberation.', reason: '孝武太皇太后李氏 appears at s0191 with explicit 隆安四年 dating.', evidence: [{ unit: 's0191', quote: '太皇太后李氏' }] },
  p121: { verdict: 'supported', event: 'Honored Lady Chen, crown prince’s mother, in Taiyuan 15.', reason: '淑媛陳氏 and crown-prince maternity are explicit at s0200 with 太元十五年.', evidence: [{ unit: 's0200', quote: '淑媛陳氏' }] }
};

const personChecks = [...prior.personChecks];
const pseen = new Set(prior.personChecks.map(p => p.id));
for (const [id, body] of Object.entries(newPeople)) {
  if (!pseen.has(id)) {
    personChecks.push({ id, ...body });
    pseen.add(id);
  }
}

const newFindings = [
  { items: ['claim-39'], problem: 'Wu Shang is cited at s0097 without Yongkang 1; the extractor attached a reign year from the table only.', action: 'Remove Yongkang 1 from the claim; keep the intercalary xiang citation undated unless another line supplies a year.' },
  { items: ['claim-51'], problem: 'Huan Wen’s opinion at s0108 has no Ningkang year on the Chinese line.', action: 'Treat as undated Eastern Jin precedent; drop Ningkang 1 Western inference.' },
  { items: ['claim-52'], problem: 'Xu Guang’s essay unit s0117 is not headed with Long\'an 4.', action: 'Do not attach Long\'an 4 to this methodological note; date only if a biographical anchor is sourced elsewhere.' },
  { items: ['claim-55'], problem: 'Chu Pou’s death at s0125 is narrated without 永和五年 or any reign year.', action: 'Owner: align with Mu-era music examples; defer Yonghe 5 until a dated line is cited.' },
  { items: ['claim-107'], problem: 'Chu dowager death is 寧康中 at s0180 but claim used Taiyuan 9.', action: 'Repair reign label to Ningkang-period contextual dating; keep month-less 寧康中 precision.' },
  { items: ['claim-109', 'claim-110', 'claim-111'], problem: 'Xiaowu’s sacrifice roster debate at s0187 lists prior rulers without a Taiyuan year.', action: 'Keep persons supported; strip unsourced Taiyuan 9 interval until debate date is anchored.' },
  { items: ['claim-100', 'claim-101'], problem: 'Yang empress–Huai narrative at s0167 lacks Taixi/Yongjia years on cited lines.', action: 'Defer Western interval until enthronement and reign spans are quoted in source.' },
  { items: ['claim-112'], problem: 'Long\'an 4 death is explicit at s0191 but Taiyuan 21 parentage start is not on the line.', action: 'Keep Long\'an 4 end; hold Xiaowu parentage interval for owner until start year is sourced.' },
  { items: ['claim-120'], problem: 'Empress Yong\'an claim lacks a dated witness unit inside the s0151–s0200 batch reviewed this run.', action: 'Defer to a later span with explicit Hui-era empress mourning text.' }
];

const findings = [...prior.findings, ...newFindings];

const reviewedUnits = [...prior.reviewedUnits];
for (let n = 96; n <= 200; n++) {
  const u = `s${String(n).padStart(4, '0')}`;
  if (!reviewedUnits.includes(u)) reviewedUnits.push(u);
}

const spanG1 = [];
for (let n = 96; n <= 150; n++) spanG1.push(`s${String(n).padStart(4, '0')}`);
const spanG2 = [];
for (let n = 151; n <= 200; n++) spanG2.push(`s${String(n).padStart(4, '0')}`);

const checksG1 = newItemChecks.filter(c => c.evidence.some(e => spanG1.includes(e.unit))).map(c => c.id);
const checksG2 = newItemChecks.filter(c => c.evidence.some(e => spanG2.includes(e.unit))).map(c => c.id);

const uniqueClaimIds = new Set(mergedChecks.filter(c => c.id.startsWith('claim-')).map(c => c.id));

const report = {
  ...prior,
  reviewedAt: new Date().toISOString(),
  summary: 'Native partial chronology through s0200 on draft #5488 post-editorial apply. Prior s0037–s0095 decisions preserved. Spans: Ningkang intercalary debate (s0096–s0117), music suspension examples (s0121–s0127), Taishi 10 Yang empress and crown-prince reform (s0130–s0165), foster-mourning and Eastern Jin grade cases (s0167–s0194), Taiyuan 15 crown-prince mother (s0200). Not chapter approval.',
  reviewContext: {
    ...prior.reviewContext,
    nextSpan: {
      startUnit: 's0201',
      endUnit: 's0260',
      label: 'Crown-prince Chen mourning deliberation continuation and further grade cases'
    },
    coverage: {
      reviewedUnits: reviewedUnits.length,
      totalUnits: packet.units.length,
      uniqueItemChecks: mergedChecks.length,
      uniqueClaimsChecked: uniqueClaimIds.size,
      totalPacketItems: packet.items.length,
      preservedEnglishRepairs: 97,
      preservedCandidateDispositions: 38,
      nextUntouchedSpan: {
        startUnit: 's0201',
        endUnit: 's0260',
        label: 'Post–Taiyuan 15 crown-prince mourning through mid-chapter grade catalogue'
      },
      spanCheckpoints: [
        { span: 's0096-s0150', newItemChecks: checksG1.length, itemIds: checksG1.sort() },
        { span: 's0151-s0200', newItemChecks: checksG2.length, itemIds: checksG2.sort() }
      ]
    }
  },
  reviewedUnits,
  itemChecks: mergedChecks,
  personChecks,
  findings,
  references: [
    ...prior.references,
    { kind: 'internal', book: 'jinshu', chapter: '020', unit: 's0096', quote: '魯襄二十八年', sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0096').zh).digest('hex')}`, reason: 'Ningkang intercalary debate opens with Lu Spring and Autumn precedent.' },
    { kind: 'internal', book: 'jinshu', chapter: '020', unit: 's0130', quote: '泰始十年', sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0130').zh).digest('hex')}`, reason: 'Taishi 10 Yang empress death anchor for crown-prince reform cluster.' },
    { kind: 'internal', book: 'jinshu', chapter: '020', unit: 's0173', quote: '康帝建元元年', sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0173').zh).digest('hex')}`, reason: 'Kangdi Jianyuan explicit date for Du empress memorial.' },
    { kind: 'internal', book: 'jinshu', chapter: '020', unit: 's0200', quote: '太元十五年', sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0200').zh).digest('hex')}`, reason: 'Taiyuan 15 Honored Lady Chen death anchor.' }
  ]
};

validateDateAuditReport(report, packet);

const out = `${ART}/date-audit-report-partial-s0037-s0200.json`;
fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);

const checkpoint = (span, start, end, ids) => ({
  schemaVersion: 1,
  kind: 'jinshu020-chronology-span-checkpoint',
  draftCommit: prior.reviewContext.draftCommit,
  span: { startUnit: start, endUnit: end, label: span },
  preservedPriorThrough: 's0095',
  newItemCheckIds: ids.sort(),
  newItemCheckCount: ids.length,
  cumulativeReviewedUnits: reviewedUnits.length,
  cumulativeItemChecks: mergedChecks.length,
  cumulativeUniqueClaimsChecked: uniqueClaimIds.size,
  nextUntouchedSpan: report.reviewContext.coverage.nextUntouchedSpan,
  notChapterApproval: true
});

fs.writeFileSync(`${ART}/chronology-span-checkpoint-s0096-s0150.json`, `${JSON.stringify(checkpoint('Ningkang intercalary through Taishi 10 crown-prince reform opening', 's0096', 's0150', checksG1), null, 2)}\n`);
fs.writeFileSync(`${ART}/chronology-span-checkpoint-s0151-s0200.json`, `${JSON.stringify(checkpoint('Du Yu proofs through Taiyuan 15 crown-prince mother', 's0151', 's0200', checksG2), null, 2)}\n`);

console.log(JSON.stringify({
  out,
  reviewedUnits: reviewedUnits.length,
  itemChecks: mergedChecks.length,
  uniqueClaimsChecked: uniqueClaimIds.size,
  g1: checksG1.length,
  g2: checksG2.length
}, null, 2));