// Independent isolated source review. Never applies decisions or writes canonical files.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import { buildEditorialReviewDossierFromLoaded } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-editorial-review.mjs';
import { validateAppliedEditorialDecisions, validateEditorialDecisions } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';

const root = new URL('./', import.meta.url);
const input = new URL('jinshu053-ending-proposed-only-incomplete-20261020/',root);
const read = name => JSON.parse(fs.readFileSync(new URL(name,input),'utf8'));
const sha = name => createHash('sha256').update(fs.readFileSync(new URL(name,input))).digest('hex');
const manifest = read('manifest.json');
for (const [name,hash] of Object.entries(manifest.outputSha256)) if (sha(name)!==hash) throw Error(`changed input ${name}`);
const source = read('source.json');
const packet = buildPeopleExtractionPacket('jinshu','053',{chapterData:source,chapterFile:new URL('source.json',input).pathname});
const extraction = validateCompactPeopleExtraction(read('candidate.json'),packet,{strictAliasDispositions:true}).normalized;
validateAppliedEditorialDecisions(read('editorial-history.json'),extraction);
const dossier = buildEditorialReviewDossierFromLoaded('jinshu',{chapterId:'053',packet,extraction},{context:2});
const seed = structuredClone(dossier.decisionSeed);
const units = new Map(source.content.flatMap(part=>part.sentences??[]).map(unit=>[unit.id,unit]));
const review = {
 s0115:['accept','A fault or pretext would still bring execution; the addressed person remains the subject.'],
 s0116:['accept','The adviser urges delaying the time so Jia will harm the heir, after which deposing her and avenging him can win merit and the desired result.'],
 s0118:['accept','Xiu uses counter-agents to spread a report that palace people intend to depose Jia and welcome the crown prince back; it is a reported plot, not an established event.'],
 s0119:['accept','The empress hears the report in fear and orders the chief medical officer Cheng Ju to mix croton and apricot-kernel pills.'],
 s0122:['accept','Lü informs Liu Zhen, who moves the prince to a small compound and denies him food, but people in the palace pass food over the wall.'],
 s0123:['accept','Lü presses medicine upon the prince, who refuses; when the prince goes to the privy, Lü uses a medicine pestle to kill him, and his cry is heard outside.'],
 s0127:['accept','The preceding speaker says this aspiration was not fulfilled, adding bitter regret.'],
 s0128:['accept','Although Yu has grave guilt he remains royal offspring; the speaker pities a commoner burial and petitions for princely rites.'],
 s0133:['accept','The speaker obeys the former sovereign’s final instruction and establishes the addressee as heir to honor their ancestors.'],
 s0135:['accept','The speaker was blind to a malign plot, causing an unnatural death, compared to Shen Sheng and Xiao Ji.'],
 s0136:['accept','The wisdom of the chief ministers and indignation of people and spirits awakened the speaker, who punished the guilty.'],
 s0137:['accept','The rhetorical question asks what benefit the punishment can provide the unjustly afflicted spirit and its bitter suffering.'],
 s0138:['accept','Grief and regret move the speaker to the innermost being.'],
 s0142:['accept','At the funeral procession’s departure wind, thunder and lightning arise and curtains and canopies fly apart.'],
 s0144:['accept','The addressee is described as outstanding from youth, with fragrant excellence flourishing; virtue is a defensible rendering of the metaphor.'],
 s0145:['reject','The phrase 既表髫齔 concerns a stage relative to childhood and tooth-shedding; “already in early childhood” may reverse its temporal force. Both exact fields need further lexical review.'],
 s0146:['accept','The sage ancestor admired the addressee’s goodness and fine qualities.'],
 s0148:['accept','The addressee was installed as heir to carry on the imperial foundation.'],
 s0149:['accept','The exclamation laments clandestine plotting by cruel actors and the resulting calamity.'],
 s0150:['accept','The parallel lines connect grief with harmonious qi and pain with the four seasons; the natural-breath wording preserves the image.'],
 s0151:['accept','The formula expresses grief and lament.'],
 s0152:['accept','The speaker attributes the addressee’s reduction and deposition to the speaker’s own lack of discernment.'],
 s0156:['reject','The context juxtaposes an earlier historical grievance with the addressee in the east, but 爾之負 may involve being wronged rather than bearing a grievance. The exact subject and sense need focused review.'],
 s0157:['accept','The rhetorical question asks who among all those with understanding is not moved to grief.'],
 s0159:['accept','Different ages repeat the same pattern and principle across past and present.'],
 s0162:['accept','The burial place is prepared so the addressee’s spirit may be at rest.'],
 s0164:['accept','The verse depicts an expansive display of feathered canopies and ordered ranks of officials.'],
 s0165:['accept','The mourners share grief and pain, and the question asks who lacks bitter sorrow.'],
 s0167:['accept','The posthumous name is Minhuai; no western date is supplied by this sentence.'],
 s0168:['accept','The burial is on the jimao day of the sixth month at Xianping; no western date is inferred.'],
 s0173:['accept','Zang’s courtesy name is Jingwen, not an independently supplied birth name.'],
 s0174:['accept','The appointment to the princely title Linhuai is in the fourth month of the first Yongkang year; no western conversion is assumed.'],
 s0176:['accept','The edict establishes Zang as imperial grandson-heir.'],
 s0178:['accept','The crown prince’s official staff is to become the grandson-heir’s staff immediately.'],
 s0179:['accept','Lun, Prince of Zhao, is to act as the grandson-heir’s Grand Mentor; the quotation closes here.'],
 s0180:['reject','The source says carriage, clothing and attendants were all Minhuai’s former ones; “attendants ... formerly used” is awkward and risks treating people as equipment. Revise wording and recheck the gate and referents.'],
 s0181:['accept','At Bronze Camel Street palace people weep, those attending sob and passersby wipe tears.'],
 s0182:['accept','The mulberry grew again in the western wing and withered on the grandson-heir’s deposition.'],
 s0183:['accept','In the first Yongning month Lun usurps the throne, reduces the grandson to Prince of Puyang and moves him with the emperor to Jinyong; the grandson is soon killed.'],
 s0184:['accept','Early in Tai’an the person receives Ai as a posthumous name; no exact western date is asserted.'],
 s0185:['accept','The historian describes Minhuai as notably intelligent and mature at an early age.'],
 s0187:['accept','People throughout the realm turned toward him and entertained considerable hopes for his future.'],
 s0191:['accept','The ruler lacked insight into hidden matters and the officials lacked the integrity to remonstrate.'],
 s0193:['accept','The lament asks how full mourning honors and profound grief could help the person who suffered cruelty.'],
 s0194:['accept','The encomium praises Minhuai’s intelligence as genuinely endowed by Heaven.'],
 s0195:['accept','The imperial grandfather cherished him and the officials craned their necks in anticipation.'],
 s0198:['accept','After he suffered ruthless cruelty, hoping for his return was futile.'],
 s0199:['accept','Observers of qi identify an imperial aura at Guangling; he is therefore made Prince of Guangling with fifty thousand households.'],
 s0202:['accept','Virtuous, respected men are selected as teachers and guardians, with the six named appointments and paired senior/junior ranks preserved.'],
 s0207:['accept','The person is enfeoffed Prince of Xiangyang in Yongkang’s first year, fourth month.'],
 s0208:['accept','The person is established imperial grandson-heir in Yongning’s first year, eighth month.'],
};
seed.reviewer = {kind:'codex',name:'Codex editorial reviewer /root/combine_review',model:null,agentId:'/root/combine_review',runId:null,completedAt:new Date().toISOString()};
seed.decisions=seed.proposals.map(p=>{
 const unit=units.get(p.unit.id); const result=review[p.unit.id];
 if(!unit||!result) throw Error(`Unreviewed ${p.id}`);
 return {repairId:p.id,decision:result[0],after:null,reason:result[1],sourceWitness:{source:'chapter-text',citation:`jinshu:053:${p.unit.id}`,excerpt:unit.zh}};
});
if(seed.decisions.length!==64) throw Error(`Expected 64 proposals, got ${seed.decisions.length}`);
validateEditorialDecisions(seed,extraction,packet);
const outputs=[['jinshu053-ending-editorial-dossier-20261020-incomplete.json',dossier],['jinshu053-ending-editorial-seed-20261020-incomplete.json',dossier.decisionSeed],['jinshu053-ending-editorial-decisions-20261020-incomplete.json',seed]];
for(const [name] of outputs) if(fs.existsSync(new URL(name,root))) throw Error(`Refusing overwrite: ${name}`);
for(const [name,value] of outputs) fs.writeFileSync(new URL(name,root),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({validated:true,historyValidated:true,chapterFingerprint:seed.input.chapterFingerprint,proposalsFingerprint:seed.input.proposalsFingerprint,counts:{accept:seed.decisions.filter(d=>d.decision==='accept').length,reject:seed.decisions.filter(d=>d.decision==='reject').length},outputs:outputs.map(([n])=>n)},null,2));
