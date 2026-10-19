// Independent isolated review; never writes canonical data or applies decisions.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import { buildEditorialReviewDossierFromLoaded } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-editorial-review.mjs';
import { validateAppliedEditorialDecisions, validateEditorialDecisions } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';

const base = new URL('jinshu053-three-review-merged-proposed-v1-incomplete-20261020/', import.meta.url);
const read = name => JSON.parse(fs.readFileSync(new URL(name,base),'utf8'));
const sha = name => createHash('sha256').update(fs.readFileSync(new URL(name,base))).digest('hex');
const manifest=read('manifest.json');
for (const [name,hash] of Object.entries(manifest.outputSha256)) if (sha(name)!==hash) throw Error(`changed input ${name}`);
const source=read('source.json');
const packet=buildPeopleExtractionPacket('jinshu','053',{chapterData:source,chapterFile:new URL('source.json',base).pathname});
const extraction=validateCompactPeopleExtraction(read('proposed-extraction.json'),packet,{strictAliasDispositions:true}).normalized;
validateAppliedEditorialDecisions(read('editorial-history.json'),extraction);
const dossier=buildEditorialReviewDossierFromLoaded('jinshu',{chapterId:'053',packet,extraction},{context:2});
if (JSON.stringify(dossier.decisionSeed)!==JSON.stringify(read('decision-seed.json'))) throw Error('dossier seed differs from pinned snapshot');
const units=new Map(source.content.flatMap(part=>part.sentences??[]).map(unit=>[unit.id,unit]));

// Entries are independently checked against the Chinese and adjacent narrative,
// not copied from earlier decision files. A rejection holds a defective proposed
// replacement; it does not assert that the pre-existing field is correct.
const checks={
s0008:'The emperor asks why, and the prince warns against illumination during a sudden nighttime emergency; the proposed question is restored.',
s0013:'The emperor tells assembled ministers the prince resembles Xuan; the prince’s reputation spreads.',
s0015:'Jia resents the good reputation and secretly has the eunuchs encourage unrestrained behavior.',
s0017:'The favored Jiang bears a son; the advisers urge rewards and toys for the grandson, and the prince follows them.',
s0018:'The prince’s laxness becomes apparent; he sometimes skips attendance and habitually plays in the rear garden.',
s0020:'The victim is unspecified; he personally strikes people who offend him, not necessarily servants.',
s0021:'The replacement omits the distinct 修牆 alongside 繕壁; both literal and idiomatic fields need a coordinated repair.',
s0022:'He has other people butcher and sell liquor and gauges weight by hand; direct butchering and coin weighing are not stated.',
s0023:'His mother was a butcher’s daughter, offered as the explanation of his liking.',
s0028:'He has another person put needles into Xi’s habitual felt seat; sewing and personal placement are not asserted.',
s0034:'Guo Huai and the prince both desired Han Shou’s daughter as a match; he sought security for himself.',
s0035:'Han Shou’s wife Jia Wu and the empress refuse and betroth him to Wang Yan’s younger daughter.',
s0041:'The empress accepts the account and circulates the prince’s faults far and wide.',
s0042:'Court and country know she intends to harm him; the wording does not overstate a specific killing method.',
s0044:'The mulberry appears in the palace western wing, grows daily, and soon withers.',
s0046:'The empress does not meet him; maid Chen Wu brings wine and jujubes and makes him drunk.',
s0056:'He copies the text while drunk and unaware; half the characters are malformed.',
s0057:'The text is filled in and the empress presents it; the actor filling the characters is not invented.',
s0059:'The material is shown to all the lords and princes; Zhang Hua and Pei Wei defend the heir.',
s0062:'Fearing a change in events she petitions to reduce him to a commoner and the edict permits it.',
s0066:'The empress has an attendant confess to an intention to rebel with the heir in the following first month.',
s0067:'The edict circulates the confession to senior ministers, not the whole city.',
s0073:'Wang Yan requests a divorce; this does not claim that divorce was completed.',
s0107:'The narrative expressly says the heir was deposed without fault and people were indignant.',
s0108:'Sima Ya is distant imperial kin, both men favored by the prince, and Sun Xiu is adviser to Lun, Prince of Zhao; the speech stays open.',
s0109:'The speaker addresses the adviser directly: service to the palace, Jia’s closeness, foreknowledge, and danger are retained.',
s0111:'Xiu tells Lun, Prince of Zhao, who accepts; the title is not a name “Zhao of Lun”.',
s0113:'The second Jia is the family or faction; the speaker addresses the prince who served the empress.',
s0114:'The threatened prince may suppress his resentment but is predicted to withhold reward and view the reversal as self-protection.',
s0115:'An exposed fault or pretext still leaves the addressee liable to execution.',
s0116:'The adviser recommends delay until Jia harms the heir, then deposing her and taking revenge to gain merit.',
s0118:'Counter-agents spread the reported palace intention; the report is not presented as an accomplished plot.',
s0119:'Croton and apricot are specified, but 杏子 itself does not unambiguously establish the kernel; hold the exact wording pending evidence.',
s0122:'Lü informs Liu Zhen; Liu starves the heir in a small compound while people in the palace pass food over the wall.',
s0123:'The heir rejects the medicine, goes to the privy, is struck with the pestle and cries loudly.',
s0127:'The first-person sentence is source-supported but the preceding s0126 idiom is a third-person summary inside the same open speech; hold until the whole passage is coordinated.',
s0128:'The literal is faithful to the memorial; the idiomatic must remain held while the preceding s0126 switches an open first-person speech into summary.',
s0133:'The speaker follows the prior sovereign’s final wishes by establishing the heir to honor the ancestors; surrounding speech still needs coordinated editing.',
s0135:'The speaker acknowledges blindness to the plot and compares the unjust death with Shen Sheng and Xiao Ji.',
s0136:'Wise ministers and people’s and spirits’ indignation awaken the speaker, and the guilty are punished.',
s0137:'The question asks what relief this gives the unjustly afflicted soul and its suffering.',
s0138:'Grief and regret shake the speaker inwardly.',
s0142:'Wind, thunder and lightning arise when the funeral sets out and curtains and canopies are blown apart.',
s0144:'The lament praises exceptional qualities in youth through the metaphor of burgeoning fragrance.',
s0146:'The sage ancestor admired the addressee’s fine qualities.',
s0148:'The addressee is established as heir to continue the imperial foundation.',
s0149:'The lament asks how cruel forces could plot secretly and cause such calamity.',
s0150:'Grief affects harmonious qi and pain reaches across the seasons, retaining the image.',
s0151:'The words are an exclamation of sorrow.',
s0152:'The speaker acknowledges personal lack of discernment in the deposition.',
s0157:'The rhetorical question asks who among people of understanding does not grieve.',
s0159:'The cases occur in different ages but follow the same pattern and principle.',
s0162:'The burial chamber has been prepared so the spirit may find rest.',
s0164:'Feathered canopies are expansive and officials are arrayed in order; no unsupported plumes are added.',
s0165:'Shared grief and pain prompt a rhetorical question about sorrow.',
s0167:'湣懷 is a posthumous name, not religious canonization.',
s0168:'The burial is stated as jimao in the sixth month at Xianping; the textual day conflict remains a date-audit issue.',
s0173:'The source states Zang’s courtesy name Jingwen without explicitly ranking him as second son.',
s0174:'He is enfeoffed Prince of Linhuai in the fourth month of Yongkang’s first year.',
s0176:'The edict establishes Zang as imperial grandson-heir.',
s0178:'The crown prince’s officials are transferred to serve the grandson-heir.',
s0179:'Lun, Prince of Zhao, is to act as the grandson-heir’s Grand Mentor; the edict closes here.',
s0181:'Palace people weep, accompanying attendants sob, and passersby wipe tears at Bronze Camel Street.',
s0182:'The mulberry grows again in the western wing and withers after the grandson is deposed.',
s0183:'Lun usurps the throne and reduces the grandson to Prince of Puyang, then the grandson moves with the emperor and is killed.',
s0184:'Ai is a name posthumously conferred early in Tai’an.',
s0185:'The historian praises Minhuai’s intelligence and early maturity.',
s0187:'The realm turns its heart toward him and has hopes of what is to come.',
s0191:'The ruler lacks the ability to uncover hidden matters and officials lack the integrity to remonstrate.',
s0193:'Funeral honors and profound sorrow cannot undo the sufferer’s cruel fate.',
s0194:'The encomium praises Minhuai’s intelligence as heaven-endowed.',
s0195:'The grandfather cherishes him and officials crane their necks in anticipation.',
s0198:'He falls victim to ruthless cruelty and hope for his return becomes vain.',
s0199:'The portent observers describe an imperial aura in Guangling and he receives its princely title and fifty thousand households.',
s0202:'The six named men are appointed to the senior and junior tutor, mentor and guardian offices.',
s0207:'He is enfeoffed Prince of Xiangyang in the fourth month of Yongkang’s first year.',
s0208:'He is established as imperial grandson-heir in the eighth month of Yongning’s first year.',
s0063:'梁王肜 is Rong, Prince of Liang, and 允 is Yun, Prince of Huainan, but 太保何劭 is He Shao the Grand Guardian, not Grand Tutor; preserve the name corrections and correct this additional office.'
};
const rejected=new Set(['r0021','r0022','r0055','r0058','r0060']);
const revised=new Set(['r0111','r0112']);
const seed=structuredClone(dossier.decisionSeed);
seed.reviewer={kind:'codex',name:'Codex independent editorial reviewer /root/lacuna_research',model:null,agentId:'/root/lacuna_research',runId:null,completedAt:new Date().toISOString()};
seed.decisions=seed.proposals.map(p=>{
  const unit=units.get(p.unit.id),reason=checks[p.unit.id],short=p.id.split(':').at(-1);
  if(!unit||!reason) throw Error(`unreviewed ${p.id}`);
  const decision=rejected.has(short)?'reject':revised.has(short)?'revise':'accept';
  let after=null;
  if(decision==='revise'){
    after=p.after.replace('Grand Tutor He Shao','Grand Guardian He Shao');
    if(after===p.after) throw Error(`office correction missing ${p.id}`);
  }
  return {repairId:p.id,decision,after,reason,sourceWitness:{source:'chapter-text',citation:`jinshu:053:${p.unit.id}`,excerpt:unit.zh}};
});
if(seed.decisions.length!==98) throw Error(`expected 98, received ${seed.decisions.length}`);
validateEditorialDecisions(seed,extraction,packet);
const target=new URL('jinshu053-merged-independent-decisions-lacuna-review-20261020-incomplete.json',import.meta.url);
fs.writeFileSync(target,JSON.stringify(seed,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({path:target.pathname,input:seed.input,counts:Object.fromEntries(['accept','reject','revise'].map(type=>[type,seed.decisions.filter(d=>d.decision===type).length])),validated:true},null,2));
