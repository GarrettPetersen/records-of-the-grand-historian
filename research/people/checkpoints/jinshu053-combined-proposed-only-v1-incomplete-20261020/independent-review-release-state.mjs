import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Independent review of the exact combined dossier. This writes an isolated
// research artifact only; it does not apply anything to the chapter.
const dir = path.dirname(fileURLToPath(import.meta.url));
const dossier = JSON.parse(fs.readFileSync(path.join(dir, 'dossier.json'), 'utf8'));
const seed = JSON.parse(fs.readFileSync(path.join(dir, 'decision-seed.json'), 'utf8'));
const judgments = [
['accept','帝問其故 restores the emperor’s question; 照見人君 concerns visibility of the ruler, not specifically his face.'],
['accept','對群臣稱太子似宣帝 and 令譽流於天下 support the stated comparison and its wide reputation.'],
['accept','素忌太子有令譽 establishes pre-existing resentment, and the instruction and quoted flattery follow directly.'],
['accept','使人 context and 隆其賞賜、多為皇孫造玩弄之器 support urging rewards and toys, followed by the prince’s compliance.'],
['accept','慢弛益彰、或廢朝侍、恆在後園遊戲 supply growing laxity, occasional missed attendance and recurring games.'],
['accept','或有犯忤者 specifies anyone offending him, not necessarily servants; 手自捶擊 means he beat them himself.'],
['accept','拘小忌 and 不許繕壁修牆，正瓦動屋 describe restraints on repairs, roof tiles and the house.'],
['accept','The proposed idiom captures 拘小忌 and the prohibited wall, tile and house work without adding builders.'],
['accept','使人屠酤 has others butcher and sell drink; 手揣斤兩，輕重不差 describes accurate hand-estimation, not weighing purchases.'],
['accept','The palace market and third-party butchering and liquor-selling are explicit; 揣斤兩 describes accurate hand estimation.'],
['accept','母本屠家女 identifies his mother as a butcher’s daughter and 故太子好之 gives the connection.'],
['accept','使人以針著錫常所坐氈中 supports placing needles in the usual felt seat; sewing is not stated.'],
['accept','使人 gives agency to another person, and 氈 supports a felt seat intended to prick Du Xi.'],
['accept','郭槐欲以韓壽女為太子妃 and 太子亦欲婚韓氏以自固 supply both desired marriage and motive.'],
['accept','賈午及后皆不聽 and 為太子聘王衍小女惠風 state refusal and betrothal, not a forced consummated marriage.'],
['accept','納其言 and 宣揚太子之短，布諸遠近 state acceptance and wide dissemination of the prince’s faults.'],
['accept','朝野咸知 and 有害太子意 support widespread awareness of an intent to harm, without asserting a specific killing.'],
['accept','六月、宮西廂、日長尺餘 and 數日而枯 preserve the omitted time, location, growth and withering.'],
['accept','后不見 and 遣婢陳舞賜以酒棗，逼飲醉之 identify separate placement and the maid’s wine and jujubes.'],
['accept','醉迷不覺、依而寫 and 字半不成 state confused copying and malformed characters rather than childish intent.'],
['accept','補成之 and 后以呈帝 establish completion and presentation, without inventing the identity of helpers.'],
['accept','遍示諸公王 and 證明太子 support showing the text broadly and the two men’s defense, not independently verified innocence.'],
['accept','The proposed idiomatic rendering restores 遍示諸公王 and limits the two named men to speaking in the prince’s defense.'],
['accept','表免太子為庶人 and 詔許之 require a memorial and imperial edict, not Jia unilaterally demoting him.'],
['accept','使黃門自首，欲與太子為逆 supplies the attendant’s confession to an intent to rebel with the prince.'],
['accept','班示公卿 means the edict circulated the confession among senior officials, not to the whole capital.'],
['accept','妃父王衍表請離婚 is a memorial requesting divorce; it does not establish that a divorce was completed.'],
['reject','The source 表國家乞加徽號 supports a first-person petition, but this isolated replacement is inside a long quotation whose surrounding literal rows switch voice and retain incompatible quote boundaries. Review as a coherent full passage.'],
['reject','The petition is first person, but the surrounding idiomatic letter still uses third-person summaries; this single replacement would leave an incoherent quoted passage.'],
['reject','疾病既篤 and 求請恩福 support the substance, but isolated first-person wording would remain surrounded by a mixed-voice quotation.'],
['reject','The proposed first-person wording is source-supported but clashes with uncorrected third-person summaries elsewhere in the same letter; coordinate the whole quotation.'],
['reject','作表求入 supports the memorial, but this literal replacement alone does not resolve the letter’s mixed narration and nested-quote boundaries.'],
['reject','作表求入 supplies the missing memorial, but the standalone first-person sentence collides with neighboring third-person summaries in the same quoted letter.'],
['reject','The reported illness is supported by 中宮旦來吐不快, but the replacement closes the embedded quote while adjacent narrative remains inconsistently quoted and narrated. Reconcile the full passage.'],
['reject','使住空屋中坐 gives the room and waiting, but the isolated voice change cannot repair surrounding mixed quotation and narration.'],
['reject','The room is supported, but switching this row to first person while neighboring letter rows remain third person is not a coherent applied translation.'],
['reject','三升酒、大盤棗 and 飲酒啖棗盡 support wine and jujubes, but a single literal change leaves surrounding direct-speech quotation inconsistent.'],
['reject','The quantity and food are supported, but the standalone first-person wording collides with third-person letter summaries around it.'],
['reject','鄙素不飲酒 and 遣舞啟說不堪三升 support the content, but this literal row is part of an unresolved mixed-voice quoted passage.'],
['reject','The source supports ordinary abstention and his message via Wu; applying this sentence alone leaves the letter’s narrative voice inconsistent.'],
['reject','且實未食，恐不堪 expresses not having eaten and fear of the drink, but the surrounding direct speech remains inconsistently narrated.'],
['reject','陳舞復傳語云 opens reported speech that continues into the next sentence 天與汝酒飲; the proposed closing quote prematurely ends it.'],
['reject','逼迫不得已，更飲一升 supports a further sheng, but the literal quotation still contains unresolved voice and quote-boundary discrepancies.'],
['reject','The amount is supported, but changing this row alone to first person leaves mixed third- and first-person narration inside the letter.'],
['reject','小婢持封箱 and 詔使寫此文書 support the young maid and instruction, but this embedded quote must be coordinated with the enclosing, inconsistently narrated letter.'],
['reject','驚起 and 白紙、青紙 support the detail, but isolated first person between remaining third-person summaries fragments the letter.'],
['reject','催促云 and 陛下停待 support the urgent words, but the nested quotation and the surrounding mixed-voice letter require one coordinated edit.'],
['reject','急疾不容復視 and 不覺紙上語輕重 support haste and inability to assess the words, but nearby letter sentences remain mixed-voice.'],
['reject','The proposed closing quote and filial trust reflect the Chinese, but the enclosing English quotation’s preceding mixed narration and existing quote boundaries require coordinated repair.'],
['accept','既廢非其罪 and 眾情憤怨 state a blameless deposition and public indignation, not only anger in the capital.'],
['accept','宗室之疏屬 and 孫秀趙王倫謀臣 identify Sima Ya’s distant kinship and Sun Xiu as the Prince of Zhao’s adviser; the speech remains open until s0110.'],
['accept','The idiom restores the distant imperial relationship and the direct speech beginning 國無適嗣 without falsely naming a Prince Zhao of Lun.'],
['accept','中宮、賈后親密 and 豫知 relate service, closeness, and alleged prior knowledge; the open speech continues to s0110.'],
['accept','The source addresses the adviser directly and says others believed he knew beforehand, not that Jia would scapegoat allies.'],
['reject','The existing literal Why not plot first already conveys 何不先謀之; changing it to make plans is unnecessary and softens the conspiratorial context.'],
['reject','The existing idiomatic Why not plot first accurately renders 何不先謀之 and closes the speech; no change is needed.'],
['accept','秀言于趙王倫，倫深納焉 identifies Xiu reporting to Lun, Prince of Zhao, and Lun accepting the advice.'],
['accept','The sentence identifies Sun Xiu and Prince of Zhao Lun and reports that Lun accepted the suggestion.'],
['accept','明公素事賈后 and 皆以公為賈氏之黨 are second-person address concerning service to Jia and perceived factional ties.'],
['accept','含忍宿忿、必不能加賞 and 逼百姓之望，翻覆以免罪 support suppressed resentment, no reward and the alleged motive for switching sides.'],
];
if (dossier.items.length !== 60 || judgments.length !== 60) throw new Error('review scope changed');
seed.reviewer = { kind:'codex', name:'Codex independent source reviewer', model:null, agentId:'/root/release_state', runId:null, completedAt:new Date().toISOString() };
seed.decisions = dossier.items.map((item, i) => {
  const [decision, reason] = judgments[i];
  if (item.proposal.id !== seed.proposals[i].id) throw new Error('dossier order mismatch');
  const focus = item.context.find(c => c.focus);
  if (!focus || focus.id !== item.proposal.unit.id) throw new Error('missing source witness');
  return {repairId:item.proposal.id, decision, after:null, reason, sourceWitness:{source:'chapter-text', citation:`jinshu:053:${focus.id}`, excerpt:focus.zh.slice(0,240)}};
});
const output = path.join(dir, 'independent-editorial-decisions-release-state-20261020.json');
if (fs.existsSync(output)) throw new Error('review output already exists; do not overwrite');
fs.writeFileSync(output, JSON.stringify(seed, null, 2) + '\n', {flag:'wx'});
console.log(JSON.stringify({output, accepted:seed.decisions.filter(x=>x.decision==='accept').length, rejected:seed.decisions.filter(x=>x.decision==='reject').length}));
