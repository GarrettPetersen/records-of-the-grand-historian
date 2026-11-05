import {draftGroup,year,interval,read,dir} from './host-date-repair-tools.mjs';
const g=draftGroup(4),group=read(dir+'host-date-repair-plan.json').groups[3];
const apply=(id,date,reason)=>{const t=g.target(id);if(['attestation','birth','death','age'].includes(t.row[1]))g.life(id,date,reason);else g.context(id,date,reason)};
for(const id of group.findings[0].items.filter(x=>x.startsWith('claim-'))){
 if(id==='claim-756'){
  g.clearContext(id,'This composite construction fact cites both s0089(the initial Longcheng palace/shrine foundation) and s0102(a later, separately narrated palace-building episode). Preserve both evidence units and the complete fact, but withdraw the shared335–341date context. Separate attestations retain each episode’s chronology; one date cannot be imposed on both.');
  continue;
 }
 const old=g.target(id).row[2],sourceDate=(old.dateContext??old).sourceDate;
 apply(id,{sourceDate,westernYear:year(341)},'The initial Longcheng foundation and court investiture precede the following regnal-year block. ZZTJ96 explicitly dates Longcheng construction to Xiankang7/firstmonth341and Guo Xi’s investiture to341. Remove the unsupported335start while preserving the source episode and all non-date fields.');
}
for(const id of group.findings[1].items.filter(x=>x.startsWith('claim-'))){
 const old=g.target(id).row[2],sourceDate=(old.dateContext??old).sourceDate;
 apply(id,{sourceDate,westernInterval:interval(341,342),event:'Chronology differs between primary witnesses: Jinshu109 narrates the Longcheng move/Wandu war under Xiankang7(341), while ZZTJ97 places the move in Xiankang8/tenthmonth and the campaign in eleventhmonth342. The interval preserves both readings without preferring either.'},'Preserve the named Jinshu Xiankang7formula and the competing ZZTJ97 Xiankang8witness. A341–342window honestly retains both chronologies; neither the341nor342point date is asserted as certain.');
}
for(const id of group.findings[2].items.filter(x=>x.startsWith('claim-'))){
 const old=g.target(id).row[2],sourceDate=(old.dateContext??old).sourceDate;
 apply(id,{sourceDate,westernInterval:interval(342,343),event:'Jinshu109 dates the submission and corpse return to 明年 after its Xiankang7block(342by that sequence); ZZTJ97 records the same episode in Jianyuan1/secondmonth343. Both witnesses are retained as a342–343window.'},'The source-backed submission and return of the father’s corpse are preserved. Replace the point342conversion with a342–343window recording Jinshu’s relative sequence and ZZTJ97’s explicit Jianyuan1/secondmonth343date.');
}
g.hints({p116:['AD 341','AD 341-342','AD 342','AD 342-343'],p117:['AD 341'],p118:['AD 341'],p119:['AD 341'],p120:['AD 341'],p121:['AD 341-342','AD 342'],p122:['AD 341-342','AD 342'],p123:['AD 341-342'],p124:['AD 341-342','AD 342-343'],p125:['AD 341-342'],p127:['AD 341-342'],p128:['AD 341-342']});
g.finish([{url:'https://zh.wikisource.org/wiki/資治通鑑/卷096',supports:'Xiankang7/341firstmonth Longcheng construction and Guo Xi investiture/arrival in341.',accessedAt:new Date().toISOString()},{url:'https://zh.wikisource.org/wiki/資治通鑑/卷097',supports:'Xiankang8/342tenthmonth capital move, eleventhmonth Wandu campaign; Jianyuan1/343secondmonth Goguryeo submission and corpse return.',accessedAt:new Date().toISOString()},{url:'https://zh.wikisource.org/wiki/晉書/卷109',supports:'Retain Xiankang7and 明年 witness; s0089and s0102are separate construction episodes.',accessedAt:new Date().toISOString()}],{primaryWitnessUncertaintyPreserved:true,compositeDateWithdrawn:['claim-756'],additionalAffectedPeople:['p116','p117','p118']});
